describe('registration', () => {
  it('registers the data in the database on registration, selects initial level, starts a session, waits for a few seconds and sees update on the profile page, then logs out', () => {

    cy.visit("http://localhost:3000")

    cy.contains("Track your meditation journey to mindfulness").should("exist");
    cy.get("[data-testid='header-sign-up']").should("exist").click();
    cy.contains("Create a new account").should("exist");

    let user = {
      username: "firstUsername",
      email: "firstEmail@gmail.com",
      password: "firstPassword"
    }

    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    //we are using this extra logic because confirm password is disabled somehow

    cy.get('input[name="confirmPassword"]').then(($input) => {
      if (!$input.prop('disabled')) {
        cy.wrap($input).type(user.password);
      }
    });


    cy.intercept("POST", 'http://localhost:7777/users/register').as("registerUser");
    cy.get("form").submit();

    cy.wait("@registerUser");
    cy.task("checkUserInDatabase", user.email).then(result => {
      expect(result).to.be.true;
    })

    // /getting-started route
    cy.contains("Welcome, firstUsername!").should("exist");

    cy.get("[data-testid='experienced-level']").should("exist").click();

    cy.intercept("POST", "http://localhost:7777/level/set-level").as("setUserLevel");
    cy.contains("Continue as Experienced").should("exist").click();

    cy.wait("@setUserLevel")
    cy.task("checkUserLevelInDatabase", user.email).then(result => {
      expect(result).to.equal(2);
    })

    // /profile route
    cy.get('[data-testid="start-a-session"]').should("exist").click();
    
    //starting the session
    cy.contains("Start Session").should("exist").click();

    cy.wait(2000);

    cy.get('[data-testid="pause-play"]').click();

    //resetting session
    cy.get("[data-testid='reset-button']").should("exist").click();

    cy.contains("00:00").should("exist");
    cy.get('[data-testid="pause-play"]').click();

    //cancelling session
    cy.wait(2000);
    cy.get('[data-testid="pause-play"]').click();
    cy.get("[data-testid='cancel-session']").should("exist").click();

    cy.get('[data-testid="confirm-session-cancellation"]').should("exist").click();

    //now for registering a session
    cy.contains("Start Session").should("exist").click();
    cy.wait(6000);
    cy.get('[data-testid="pause-play"]').click();
    cy.contains("00:05").should("exist");
    cy.intercept("POST", 'http://localhost:7777/session/end-session').as('endSession');
    cy.get('[data-testid="end-session-button"]').should("exist").click();

    //end session database check
    cy.wait("@endSession");
    cy.task("checkDatabaseAfterSessionEnd", user.email).then(result => {
      expect(result).to.be.true;
    })
    //logout
    cy.contains("Logout").click();
    cy.get("[data-testid='confirm-logout-button']").should("exist").click();

    cy.contains("Track your meditation journey to mindfulness.").should("exist");
  })
});

