describe("database wipe", () => {
    it ("just a database wipe command", () => {
        cy.task("resetDatabase");
    })
})