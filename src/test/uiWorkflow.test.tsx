import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('End-to-End Application UI Workflow', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    window.print = vi.fn();
  });

  it('renders application home page with hero headline and radial artwork', () => {
    render(<App />);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
    expect(headings[0].textContent).toContain('Ancient Wisdom');

    // Canonical status badge is always present on home page
    const statusBadges = screen.getAllByText(/Canonical Manuscript/i);
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  it('navigates seamlessly across all main views via navigation buttons', async () => {
    const { container } = render(<App />);

    // Navigate to Assessment
    const assessBtn = container.querySelector('#nav-assessment') as HTMLElement;
    expect(assessBtn).not.toBeNull();
    fireEvent.click(assessBtn);
    expect(screen.getAllByText(/Assessment/i).length).toBeGreaterThan(0);

    // Navigate to Reference Library
    const libBtn = container.querySelector('#nav-library') as HTMLElement;
    expect(libBtn).not.toBeNull();
    fireEvent.click(libBtn);
    expect(screen.getAllByText(/Canonical Reference Library/i).length).toBeGreaterThan(0);

    // Navigate to Source Gallery
    const galleryBtn = container.querySelector('#nav-gallery') as HTMLElement;
    expect(galleryBtn).not.toBeNull();
    fireEvent.click(galleryBtn);
    expect(screen.getAllByText(/Manuscript Photographic Plates/i).length).toBeGreaterThan(0);

    // Navigate to Research
    const resBtn = container.querySelector('#nav-research') as HTMLElement;
    expect(resBtn).not.toBeNull();
    fireEvent.click(resBtn);
    expect(screen.getAllByText(/Research, Provenance & Scholarly DOIs/i).length).toBeGreaterThan(0);

    // Navigate to History
    const histBtn = container.querySelector('#nav-history') as HTMLElement;
    expect(histBtn).not.toBeNull();
    fireEvent.click(histBtn);
    expect(screen.getAllByText(/Local Session History/i).length).toBeGreaterThan(0);
  });

  it('Assessment Form: opens in Virarkadai mode by default without cm/mm options, submits 10, renders canonical match', async () => {
    const { container } = render(<App />);

    // Go to Assessment
    const assessNav = container.querySelector('#nav-assessment') as HTMLElement;
    fireEvent.click(assessNav);

    // Verify cm and mm buttons are NOT present in the assessment form UI
    expect(container.querySelector('#unit-cm-btn')).toBeNull();
    expect(container.querySelector('#unit-mm-btn')).toBeNull();

    // Verify Traditional Wrist Unit label is present
    expect(screen.getAllByText(/Traditional Wrist Unit \(விரற்கடை\)/i).length).toBeGreaterThan(0);

    // Input 10 is default or enter 10
    const input = container.querySelector('#wrist-measurement-input') as HTMLInputElement;
    expect(input).not.toBeNull();
    fireEvent.change(input, { target: { value: '10' } });

    // Click submit
    const submitBtn = container.querySelector('#find-reference-entry-btn') as HTMLElement;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/Assessment Outcome/i).length).toBeGreaterThan(0);
    });

    // Check that canonical manuscript match details are rendered
    expect(screen.getAllByText(/10 விரற்கடை/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Page 368/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/வாயுவினால் நெஞ்சு/i).length).toBeGreaterThan(0);

    // Check persistence to history
    const histNav = container.querySelector('#nav-history') as HTMLElement;
    fireEvent.click(histNav);
    expect(screen.getAllByText(/10 virarkadai/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Canonical Match/i).length).toBeGreaterThan(0);
  });

  it('Assessment Form: submits fraction 7½, replaces report immediately with page 368 match', async () => {
    const { container } = render(<App />);

    const assessNav = container.querySelector('#nav-assessment') as HTMLElement;
    fireEvent.click(assessNav);

    const input = container.querySelector('#wrist-measurement-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '7½' } });

    const submitBtn = container.querySelector('#find-reference-entry-btn') as HTMLElement;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/7 ½ விரற்கடை/i).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText(/எலும்புருக்கி/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Page 368/i).length).toBeGreaterThan(0);
  });

  it('Assessment Form: submits 3.5 (unmatched), renders explicit no-match report with nearest suggestions', async () => {
    const { container } = render(<App />);

    const assessNav = container.querySelector('#nav-assessment') as HTMLElement;
    fireEvent.click(assessNav);

    const input = container.querySelector('#wrist-measurement-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '3.5' } });

    const submitBtn = container.querySelector('#find-reference-entry-btn') as HTMLElement;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/No Authentic Manuscript Entry Found/i).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText(/The classical manuscript table covers values strictly from 4 to 10 in ¼ increments/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4 விரற்கடை/i).length).toBeGreaterThan(0);
  });

  it('Assessment Form: reset button clears report and resets measurement input', async () => {
    const { container } = render(<App />);

    const assessNav = container.querySelector('#nav-assessment') as HTMLElement;
    fireEvent.click(assessNav);

    // Submit an assessment first
    const submitBtn = container.querySelector('#find-reference-entry-btn') as HTMLElement;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/Assessment Outcome/i).length).toBeGreaterThan(0);
    });

    // Click reset
    const resetBtn = container.querySelector('#assessment-reset-btn') as HTMLElement;
    expect(resetBtn).not.toBeNull();
    fireEvent.click(resetBtn);

    // Verify report section is cleared
    expect(container.querySelector('#assessment-report-section')).toBeNull();
  });

  it('searches the canonical Reference Library for 4¼, 6, 7½, 8¾, and 10 accurately', async () => {
    const { container } = render(<App />);

    const libNav = container.querySelector('#nav-library') as HTMLElement;
    fireEvent.click(libNav);

    const searchInput = container.querySelector('#library-search-input') as HTMLInputElement;
    expect(searchInput).not.toBeNull();

    // 1. Search for 4¼
    fireEvent.change(searchInput, { target: { value: '4¼' } });
    await waitFor(() => {
      expect(screen.getAllByText('4 ¼').length).toBeGreaterThan(0);
    });

    // 2. Search for 6
    fireEvent.change(searchInput, { target: { value: '6' } });
    await waitFor(() => {
      expect(screen.getAllByText('6').length).toBeGreaterThan(0);
    });

    // 3. Search for 7½
    fireEvent.change(searchInput, { target: { value: '7½' } });
    await waitFor(() => {
      expect(screen.getAllByText('7 ½').length).toBeGreaterThan(0);
    });

    // 4. Search for 8¾
    fireEvent.change(searchInput, { target: { value: '8¾' } });
    await waitFor(() => {
      expect(screen.getAllByText('8 ¾').length).toBeGreaterThan(0);
    });

    // 5. Search for 10
    fireEvent.change(searchInput, { target: { value: '10' } });
    await waitFor(() => {
      expect(screen.getAllByText('10').length).toBeGreaterThan(0);
    });
  });

  it('toggles language between English and Tamil across the UI', async () => {
    const { container } = render(<App />);

    const langToggleBtn = container.querySelector('#language-toggle-btn') as HTMLElement;
    expect(langToggleBtn).not.toBeNull();
    fireEvent.click(langToggleBtn);

    // After toggle to Tamil, Tamil headline should be visible in the h1
    const tamilHeadings = screen.getAllByRole('heading', { level: 1 });
    expect(tamilHeadings[0].textContent).toContain('பழங்கால ஞானம்');

    // Toggle back to English
    fireEvent.click(langToggleBtn);
    const enHeadings = screen.getAllByRole('heading', { level: 1 });
    expect(enHeadings[0].textContent).toContain('Ancient Wisdom');
  });

  it('Assessment Report Print: triggers window.print and populates assessment-print-section with canonical report data', async () => {
    const { container } = render(<App />);

    // Go to Assessment
    const assessNav = container.querySelector('#nav-assessment') as HTMLElement;
    fireEvent.click(assessNav);

    // Enter 10 virarkadai
    const input = container.querySelector('#wrist-measurement-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10' } });

    // Submit
    const submitBtn = container.querySelector('#find-reference-entry-btn') as HTMLElement;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(container.querySelector('#assessment-print-section')).not.toBeNull();
    });

    const printSection = container.querySelector('#assessment-print-section') as HTMLElement;
    expect(printSection.textContent).toContain('Manikkadai Nool (மணிக்கடை நூல்)');
    expect(printSection.textContent).toContain('10 virarkadai');
    expect(printSection.textContent).toContain('Page 368');
    expect(printSection.textContent).toContain('வாயுவினால் நெஞ்சு');
    expect(printSection.textContent).toContain('Disease Manifestation');

    // Click print button
    const printBtn = container.querySelector('#print-report-btn') as HTMLElement;
    expect(printBtn).not.toBeNull();
    fireEvent.click(printBtn);
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('Session History Print: prints only the currently selected record and updates when selection changes', async () => {
    const { container } = render(<App />);

    // 1. Submit first assessment: 10 virarkadai
    const assessNav = container.querySelector('#nav-assessment') as HTMLElement;
    fireEvent.click(assessNav);
    const input = container.querySelector('#wrist-measurement-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(container.querySelector('#find-reference-entry-btn') as HTMLElement);

    // 2. Submit second assessment: 7½ virarkadai with notes
    await waitFor(() => expect(screen.getAllByText(/Assessment Outcome/i).length).toBeGreaterThan(0));
    fireEvent.change(input, { target: { value: '7½' } });
    const notesInput = container.querySelector('#assessment-notes-input') as HTMLTextAreaElement;
    if (notesInput) {
      fireEvent.change(notesInput, { target: { value: 'Patient demonstrates wrist stiffness' } });
    }
    fireEvent.click(container.querySelector('#find-reference-entry-btn') as HTMLElement);
    await waitFor(() => expect(screen.getAllByText(/எலும்புருக்கி/i).length).toBeGreaterThan(0));

    // 3. Navigate to History
    const histNav = container.querySelector('#nav-history') as HTMLElement;
    fireEvent.click(histNav);

    await waitFor(() => {
      expect(screen.getAllByText(/Local Session History/i).length).toBeGreaterThan(0);
    });

    // Verify history print section exists and matches the initially selected record (most recent = 7½)
    const printSection = container.querySelector('#history-print-section') as HTMLElement;
    expect(printSection).not.toBeNull();
    expect(printSection.textContent).toContain('7 ½');
    expect(printSection.textContent).toContain('எலும்புருக்கி');
    expect(printSection.textContent).toContain('Patient demonstrates wrist stiffness');

    // Click history print button
    const printBtn = container.querySelector('#history-print-selected-btn') as HTMLElement;
    expect(printBtn).not.toBeNull();
    fireEvent.click(printBtn);
    expect(window.print).toHaveBeenCalled();

    // 4. Switch selection to the 10 virarkadai record
    const historyCards = container.querySelectorAll('[id^="history-item-"]');
    expect(historyCards.length).toBeGreaterThanOrEqual(2);
    // Find card with 10 virarkadai
    const record10Card = Array.from(historyCards).find((c) => c.textContent?.includes('10 virarkadai'));
    expect(record10Card).toBeDefined();
    fireEvent.click(record10Card as HTMLElement);

    // Verify history print section now contains 10 virarkadai details and NOT 7½
    await waitFor(() => {
      const updatedPrintSection = container.querySelector('#history-print-section') as HTMLElement;
      expect(updatedPrintSection.textContent).toContain('10 virarkadai');
      expect(updatedPrintSection.textContent).toContain('வாயுவினால் நெஞ்சு');
      expect(updatedPrintSection.textContent).not.toContain('7 ½');
    });

    // Click print again
    fireEvent.click(container.querySelector('#history-print-selected-btn') as HTMLElement);
    expect(window.print).toHaveBeenCalledTimes(2);
  });
});
