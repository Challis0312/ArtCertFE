import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailsForm from '../detailsForm.jsx';
import { useAuth } from '../../contexts/authContext';

/**************************************************************************************************/

/**
 * @file        defatilsForm.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/10/2025
 * @license     -- tbd
 */

// Mock auth and upload dependencies
jest.mock('../../contexts/authContext');
jest.mock('../dragDropFile.jsx', () => ({ setFormData }) => (
	<div data-testid="mock-drag-drop"
		onClick={() =>
			setFormData((prev) => ({
				...prev,
				file: new File(['x'], 'x.png', { type: 'image/png' }),
			}))
		}>
		MockDragDrop
	</div>
));

const setup = ({ authUser = { sub: 'the-user' }, artwork = { artistsId: 'the-user' }, formOverrides = {} } = {}) => {

	useAuth.mockReturnValue({ user: authUser, isAuthenticated: !!authUser });
	const formData = {
		artist: 'Artist Name',
		title: '',
		medium: 'None',
		width: '',
		height: '',
		year: '',
		month: '',
		day: '',
		description: '',
		tags: [],
		file: null,
		...formOverrides,
	};

	const setFormData = jest.fn((updater) => {
		const next = typeof updater === 'function' ? updater(formData) : updater;
		Object.assign(formData, next);
	});

	const onSave = jest.fn(() => Promise.resolve());

	render(
		<DetailsForm
			artwork={artwork}
			formData={formData}
			setFormData={setFormData}
			onSave={onSave}
		/>
	);

	return { formData, setFormData, onSave };
};

describe('DetailsForm', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('allows owner to edit fields, upload a file and submit', async () => {
		const { formData, setFormData, onSave } = setup();

		// Banner text indicates editable state
		expect(
			screen.getByText('Manage and edit the details for your artwork.')
		).toBeInTheDocument();

		// Can't change artist
		const artist = screen.getByLabelText('Artist');
		expect(artist).toBeDisabled();

		// Title enabled and changeable
		const title = screen.getByLabelText('Artwork Title');
		expect(title).toBeEnabled();
		fireEvent.change(title, { target: { value: 'Artwork Name' } });
		expect(setFormData).toHaveBeenCalled();
		expect(formData.title).toBe('Artwork Name');

		// Dimensions and date
		fireEvent.change(screen.getByLabelText('Width', { selector: '#width' }), { target: { value: '100' } });
		fireEvent.change(screen.getByLabelText('Height', { selector: '#height' }), { target: { value: '200' } });
		fireEvent.change(screen.getByLabelText('Year', { selector: '#year' }), { target: { value: '2020' } });
		fireEvent.change(screen.getByLabelText('Month', { selector: '#month' }), { target: { value: '10' } });
		fireEvent.change(screen.getByLabelText('Day', { selector: '#day' }), { target: { value: '15' } });

		// Description
		fireEvent.change(screen.getByLabelText('Description'), {
			target: { value: 'Some description' },
		});

		// Add a tag
		const tagInput = screen.getByLabelText('Tags').parentElement.querySelector('input#tag');
		fireEvent.change(tagInput, { target: { value: 'Abstract' } });
		fireEvent.click(screen.getByRole('button', { name: 'Add' }));
		expect(formData.tags).toContain('Abstract');

		// Mock upload
		fireEvent.click(screen.getByTestId('mock-drag-drop'));
		expect(formData.file).toBeInstanceOf(File);

		// Submit
		fireEvent.click(screen.getByRole('button', { name: /save/i }));

		// onSave receives current formData (values are strings from inputs)
		expect(onSave).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Artwork Name',
				width: '100',
				height: '200',
				year: '2020',
				month: '10',
				day: '15',
				description: 'Some description',
				tags: expect.arrayContaining(['Abstract']),
				file: expect.any(File),
			})
		);
	});

	it("doesn't submit if numeric fields contain alphabetic characters", () => {
		const { onSave } = setup();
		fireEvent.change(screen.getByLabelText('Artwork Title'), { target: { value: 'A' } });
		fireEvent.change(screen.getByLabelText('Width', { selector: '#width' }), { target: { value: '10a' } });
		fireEvent.change(screen.getByLabelText('Height', { selector: '#height' }), { target: { value: 'DDD' } });
		fireEvent.change(screen.getByLabelText('Year', { selector: '#year' }), { target: { value: 'o' } });
		fireEvent.change(screen.getByLabelText('Month', { selector: '#month' }), { target: { value: '1O' } });
		fireEvent.change(screen.getByLabelText('Day', { selector: '#day' }), { target: { value: '1d' } });
		fireEvent.click(screen.getByRole('button', { name: /save/i }));
		expect(onSave).not.toHaveBeenCalled();
	});

	it("doesn't submit if numeric fields contain negative values", () => {
		const { onSave } = setup();
		fireEvent.change(screen.getByLabelText('Artwork Title'), { target: { value: 'A' } });
		fireEvent.change(screen.getByLabelText('Width', { selector: '#width' }), { target: { value: '-1' } });
		fireEvent.change(screen.getByLabelText('Height', { selector: '#height' }), { target: { value: '-1' } });
		fireEvent.change(screen.getByLabelText('Year', { selector: '#year' }), { target: { value: '-1' } });
		fireEvent.change(screen.getByLabelText('Month', { selector: '#month' }), { target: { value: '-1' } });
		fireEvent.change(screen.getByLabelText('Day', { selector: '#day' }), { target: { value: '-1' } });
		fireEvent.click(screen.getByRole('button', { name: /save/i }));
		expect(onSave).not.toHaveBeenCalled();
	});

	it("doesn't submit if numeric fields contain value of 0", () => {
		const { onSave } = setup();
		fireEvent.change(screen.getByLabelText('Artwork Title'), { target: { value: 'Art' } });
		fireEvent.change(screen.getByLabelText('Width', { selector: '#width' }), { target: { value: '0' } });
		fireEvent.change(screen.getByLabelText('Height', { selector: '#height' }), { target: { value: '0' } });
		fireEvent.change(screen.getByLabelText('Year', { selector: '#year' }), { target: { value: '0' } });
		fireEvent.change(screen.getByLabelText('Month', { selector: '#month' }), { target: { value: '0' } });
		fireEvent.change(screen.getByLabelText('Day', { selector: '#day' }), { target: { value: '0' } });
		fireEvent.click(screen.getByRole('button', { name: /save/i }));
		expect(onSave).not.toHaveBeenCalled();
	});

	it("doesn't submit if a field is left empty", () => {
		const { onSave } = setup();
		fireEvent.click(screen.getByRole('button', { name: /save/i }));
		expect(onSave).not.toHaveBeenCalled();
	});

	test('owner can remove an existing tag', () => {
		const { formData, setFormData } = setup({ formOverrides: { tags: ['ToRemove', 'Keep'] } });

		const chip = screen.getByText('ToRemove');
		const removeIcon = chip.previousElementSibling;
		fireEvent.click(removeIcon);

		expect(setFormData).toHaveBeenCalled();
		expect(formData.tags).toEqual(['Keep']);
	});
});
