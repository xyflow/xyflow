import { useKeyPress } from '@xyflow/react';

describe('useKeyPress', () => {
  it('clears a modifier whose keyup was swallowed when the user interacts again', () => {
    cy.mount(<KeyPressProbe />);

    cy.document().then((doc) => {
      doc.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Shift',
          code: 'ShiftLeft',
          shiftKey: true,
          bubbles: true,
        })
      );
    });

    cy.get('[data-testid="shift-state"]').should('have.attr', 'data-pressed', 'true');

    // The modifier is still physically held, so the pointer interaction must not clear it.
    cy.window().then((win) => {
      win.dispatchEvent(new PointerEvent('pointerdown', { shiftKey: true, bubbles: true }));
    });
    cy.get('[data-testid="shift-state"]').should('have.attr', 'data-pressed', 'true');

    // Simulate the next interaction after the OS overlay swallowed Shift's keyup.
    cy.window().then((win) => {
      win.dispatchEvent(new PointerEvent('pointerdown', { shiftKey: false, bubbles: true }));
    });
    cy.get('[data-testid="shift-state"]').should('have.attr', 'data-pressed', 'false');
  });
});

function KeyPressProbe() {
  const shiftPressed = useKeyPress('Shift');
  return <div data-testid="shift-state" data-pressed={String(shiftPressed)} />;
}
