/// <reference types="cypress" />

describe('AutoComplete challenge testing', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
      cy.intercept(
        { method: 'GET' , url: 'https://api.github.com/search/users?q=asd&per_page=50'},
        { fixture: 'githubUsers'}
      ).as('githubUser');
      cy.intercept(
        { method: 'GET' , url: 'https://api.github.com/search/repositories?q=asd&per_page=50'},
        { fixture: 'githubRepos'}
      ).as('githubRepo');
      cy.get('#autocomplete input').type('asd')
      cy.wait(['@githubUser'])
      cy.wait(['@githubRepo'])

    });
    
    it('clicking',()=>{
      cy.get('#item-0').click()
    })
    
    it('arrow behaviour',()=>{
      cy.get('#autocomplete input').type('{downArrow}')
      cy.get('#autocomplete input').type('{downArrow}')
      cy.get('#autocomplete input').type('{upArrow}')
      cy.get('.bg-blue-100').contains('asd00012334')
      cy.get('#autocomplete input').type('{Enter}')
    })

    it('clicking outside of the component',()=>{
      cy.get('#dropdown').should('exist');
      cy.get('body').click(0,0);
      cy.get('#dropdown').should('not.exist');
    })

    it('backspace and boldness of searched phrase',()=>{
      cy.get('#item-0 b').contains('asd')
      cy.get('#autocomplete input').type('{downArrow}')
      cy.get('#autocomplete input').type('{Backspace}')
      cy.get('#item-0 b').contains('asd0001233')
    })
})