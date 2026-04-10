import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../src/components/islands/ThemeToggle';

describe('ThemeToggle Component', () => {
    beforeEach(() => {
        // Clear localStorage and reset DOM
        localStorage.clear();
        document.documentElement.classList.remove('dark');

        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    it('should render toggle button', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toBeDefined();
    });

    it('should toggle theme when clicked', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');

        // Initially light mode
        expect(localStorage.getItem('theme')).toBeNull();

        // Click to switch to dark
        fireEvent.click(button);
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        // Click again to switch back to light
        fireEvent.click(button);
        expect(localStorage.getItem('theme')).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should have accessible aria-label', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button.getAttribute('aria-label')).toContain('Switch to');
    });
});
