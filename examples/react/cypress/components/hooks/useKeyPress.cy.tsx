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

    cy.get('[data-testid="shift-key"]').should('have.attr', 'data-pressed', 'true');
    cy.get('[data-testid="shift-code"]').should('have.attr', 'data-pressed', 'true');

    // The modifier is still physically held, so the pointer interaction must not clear it.
    cy.document().then((doc) => {
      doc.dispatchEvent(new PointerEvent('pointerdown', { shiftKey: true, bubbles: true }));
    });
    cy.get('[data-testid="shift-key"]').should('have.attr', 'data-pressed', 'true');
    cy.get('[data-testid="shift-code"]').should('have.attr', 'data-pressed', 'true');

    // Simulate the next interaction after the OS overlay swallowed Shift's keyup.
    cy.document().then((doc) => {
      doc.dispatchEvent(new PointerEvent('pointerdown', { shiftKey: false, bubbles: true }));
    });
    cy.get('[data-testid="shift-key"]').should('have.attr', 'data-pressed', 'false');
    cy.get('[data-testid="shift-code"]').should('have.attr', 'data-pressed', 'false');
  });
});

function KeyPressProbe() {
  const shiftPressed = useKeyPress('Shift');
  const shiftCodePressed = useKeyPress('ShiftLeft');

  return (
    <>
      <div data-testid="shift-key" data-pressed={String(shiftPressed)} />
      <div data-testid="shift-code" data-pressed={String(shiftCodePressed)} />
    </>
  );
}
