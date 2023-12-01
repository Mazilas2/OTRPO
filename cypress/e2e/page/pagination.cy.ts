describe('template spec', () => {
  it('passes', () => {
    cy.visit("http://localhost:3000/Home");
    cy.get("div").should("have.class", "container");
    cy.get("div").should("have.class", "pagination-container");
    cy.get("div").should("have.class", "join");
    // Get button with text Next
    cy.get("button").contains("Next");
    // Get button with text Previous
    cy.get("button").contains("Previous");
    // Get each page by clicking on the button Next
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Previous").click();
  })
})