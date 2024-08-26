// Test pokemon search
describe("Search bar test", () => {
    it("opens the main page and click first pokemon card", () => {
        cy.visit("/");

        cy.get("#search-bar", { timeout: 5000, scrollBehavior: false }).type(
            "pikachu"
        );

        cy.get("#pokemon-card", {
            timeout: 10000,
            scrollBehavior: false,
        }).should("have.length.greaterThan", 0);

        cy.wait(2000);
        cy.screenshot("search-bar");
    });
});

// Test pokemon widget
describe("pokemon widget test", () => {
    it("opens the main page and click first pokemon card", () => {
        cy.visit("/");

        cy.get("#pokemon-card", {
            timeout: 10000,
            scrollBehavior: false,
        }).should("have.length.greaterThan", 0);

        cy.get("#pokemon-card", { timeout: 5000, scrollBehavior: false })
            .first()
            .click();

        cy.get("#pokemon-widget", {
            timeout: 5000,
            scrollBehavior: false,
        }).should("be.visible");
        cy.wait(2000);
        cy.log("Pokemon widget found");

        cy.screenshot("pokemon-widget");
    });
});

// SHould maybe run the auth tests twice with 2 different users

// Sign up for an account
describe("signup and logout test", () => {
    it("opens the signup page and tries to sign up for an account, Then signs out", () => {
        // Sign up
        cy.visit("/signup");

        cy.get('input[name="username"]').type("testuser");

        cy.get('input[name="email"]').type("test@vitruve.fit");

        cy.get('input[name="password"]').type("testpassword");

        cy.get('button[type="submit"]').click();

        cy.wait(2000);

        // Click logout button
        cy.get("#logout-button", {
            timeout: 5000,
            scrollBehavior: false,
        }).should("be.visible");

        cy.get("#logout-button").click();

        // Check if we are logged out
        cy.get("#login-page-header", {
            timeout: 5000,
            scrollBehavior: false,
        }).should("be.visible");
        cy.wait(2000);

        cy.screenshot("signup-success");
    });
});

// Sign into the account we just made
describe("sign in test", () => {
    it("opens the sign page and tries to sign in", () => {
        cy.visit("/login");

        cy.get('input[name="email"]').type("test@vitruve.fit");
        cy.get('input[name="password"]').type("testpassword");
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        cy.get("#logout-button", {
            timeout: 5000,
            scrollBehavior: false,
        }).should("be.visible");

        cy.log("logout button found");

        cy.screenshot("sign-in-success");
    });
});
