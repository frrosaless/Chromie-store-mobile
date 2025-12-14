describe('Prueba e2e login y navegacion', () => {
  it('Login exitoso', () => {
    cy.visit('http://localhost:8100/login')
    cy.get('ion-input[formControlName="username"]').type('dawz')
    cy.get('ion-input[formControlName="password"]').type('123456')
    cy.get('ion-button[type="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', '/home')
  })

  it('boton registro', () => {
    cy.visit('http://localhost:8100/login')
    cy.contains('Regístrate').click()
    cy.url().should('include', '/registro')
  })

  it('carritodecompras', () => {
    cy.visit('http://localhost:8100/login')
    cy.get('ion-input[formControlName="username"]').type('dawz')
    cy.get('ion-input[formControlName="password"]').type('123456')
    cy.get('ion-button[type="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', '/home')
    cy.get('ion-button[routerLink="/carrito"]').click({ force: true })
    cy.url().should('include', '/carrito')
  })

  it('perfil', () => {
    cy.visit('http://localhost:8100/login')
    cy.get('ion-input[formControlName="username"]').type('dawz')
    cy.get('ion-input[formControlName="password"]').type('123456')
    cy.get('ion-button[type="submit"]').click()
    cy.wait(2000)
    cy.url().should('include', '/home')
    cy.get('ion-button[routerLink="/perfil"]').click({ force: true })
    cy.url().should('include', '/perfil')
  })
});