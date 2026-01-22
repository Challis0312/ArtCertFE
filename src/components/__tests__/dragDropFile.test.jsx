import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DragDropFile from '../dragDropFile.jsx';

/**************************************************************************************************/

/**
 * @file        dragDropFile.test.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     18/09/2025
 * @license     -- tbd
 */

// Mock allowed extensions and validation util to simplify behavior
jest.mock('../../utils/isValidExtension', () => jest.fn(() => true));
jest.mock('../../config/fileExtensionsConfig', () => ['png', 'jpg']);

describe('DragDropFile', () => {
  const setup = (formData = {}) => {
    const setFormData = jest.fn();
    render(
      <DragDropFile
        formData={formData}
        setFormData={setFormData}
        text="Display photo"
        id="file"
      />
    );
    return { setFormData };
  };

  test('clicking choose file triggers file input change with PNG', () => {
    const { setFormData } = setup({});

    // Simulate user clicking to open file chooser
    const input = screen.getByLabelText(/display photo/i);
    const file = new File(['photoimagefilecontents'], 'photo.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText(/display photo/i), { target: { files: [file] } });
    expect(setFormData).toHaveBeenCalled();
  });

  test('clicking choose file triggers file input change with DNG', () => {
    const { setFormData } = setup({});

    // Simulate user clicking to open file chooser
    const input = screen.getByLabelText(/display photo/i);
    const file = new File(['photoimagefilecontents'], 'photo.dng', { type: 'image/dng' });

    fireEvent.change(screen.getByLabelText(/display photo/i), { target: { files: [file] } });
    expect(setFormData).toHaveBeenCalled();
  });


  test('drag and drop sets file with JPG', () => {
    const { setFormData } = setup({});

    const dropZone = screen.getByText(/or drag and drop them here/i).parentElement;
    const file = new File(['123'], 'image.jpg', { type: 'image/jpeg' });

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

    expect(setFormData).toHaveBeenCalled();
  });

  test('invalid file type shows alert', () => {
    const { setFormData } = setup({});

    // Force isValidExtension mock to return false for this test
    const isValidExtensionMock = jest.requireMock('../../utils/isValidExtension');
    isValidExtensionMock.mockImplementation(() => false);

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const input = screen.getByLabelText(/display photo/i);
    const invalidFile = new File(['%PDF-1.4'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [invalidFile] } });

    expect(alertSpy).toHaveBeenCalled();
    expect(setFormData).not.toHaveBeenCalled();
    isValidExtensionMock.mockImplementation(() => true);
    alertSpy.mockRestore();
  });

  test('renders preview image for non-DNG and placeholder for DNG', () => {
    // Mock URL.createObjectURL before rendering
    global.URL.createObjectURL = jest.fn(() => 'blob:mock');
    
    const imageFile = new File(['img'], 'photo.png', { type: 'image/png' });
    const dngFile = new File(['raw'], 'photo.dng', { type: 'image/dng' });

    const { rerender } = render(
      <DragDropFile file={imageFile} formData={{}} setFormData={jest.fn()} text="Display photo" id="file" />
    );
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
    expect(global.URL.createObjectURL).toHaveBeenCalled();

    rerender(
      <DragDropFile file={dngFile} formData={{}} setFormData={jest.fn()} text="Display photo" id="file" />
    );
    expect(screen.getByText('DNG Preview')).toBeInTheDocument();
    
    // Clean up
    delete global.URL.createObjectURL;
  });
});
