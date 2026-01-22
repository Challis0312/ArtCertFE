import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewArtworkForm from '../newArtworkForm.jsx';

/**************************************************************************************************/

/**
 * @file        newArtworkForm.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

describe('NewArtworkForm', () => {
  const setup = () => {
    const formData = {
      isArtist: false,
      artistFirstName: '',
      artistLastName: '',
      title: '',
      medium: '',
      dimensions: { width: 0, height: 0 },
      dateOfProduction: { year: 0, month: 0, day: 0 },
    };
    const setFormData = jest.fn((updater) => {
      const result = typeof updater === 'function' ? updater(formData) : updater;
      Object.assign(formData, result);
    });
    const onFormDataChange = jest.fn((e) => {
      const { name, value } = e.target;
      formData[name] = value;
    });

    render(
      <NewArtworkForm
        formData={formData}
        setFormData={setFormData}
        onFormDataChange={onFormDataChange}/>
    );

    return { formData, setFormData, onFormDataChange };
  };

  test('updates all fields', () => {
    const { onFormDataChange, setFormData } = setup();

    // Artist first/last name inputs use the same placeholder and labels are miswired
    const [artistFirstNameInput, artistLastNameInput] = screen.getAllByPlaceholderText("Enter the artist's name");
    fireEvent.change(artistFirstNameInput, { target: { value: 'Gustav', name: 'artistFirstName' } });
    fireEvent.change(artistLastNameInput, { target: { value: 'Klimt', name: 'artistLastName' } });

    fireEvent.change(screen.getByLabelText('Artwork Title'), { target: { value: 'The Kiss', name: 'title' } });
    fireEvent.change(screen.getByLabelText('Medium'), { target: { value: 'Oil and gold leaf', name: 'medium' } });
    expect(onFormDataChange).toHaveBeenCalledTimes(4);
    
    fireEvent.change(screen.getByLabelText('Width'), { target: { value: '500', name: 'width' } });
    fireEvent.change(screen.getByLabelText('Height'), { target: { value: '600', name: 'height' } });
    fireEvent.change(screen.getByLabelText('Year'), { target: { value: '1908', name: 'year' } });
    fireEvent.change(screen.getByLabelText('Month'), { target: { value: '6', name: 'month' } });
    fireEvent.change(screen.getByLabelText('Day'), { target: { value: '12', name: 'day' } });
    expect(setFormData).toHaveBeenCalledTimes(5);
  });
});
