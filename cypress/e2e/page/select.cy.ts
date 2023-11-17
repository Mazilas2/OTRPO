describe('template spec', () => {
  it('passes', () => {
    cy.visit("http://localhost:3000/Home");
    cy.get("div").should("have.class", "select-btn");
    // Click on button inside div with class select-btn
    cy.get("div.select-btn button").click({multiple: true});
  })
})