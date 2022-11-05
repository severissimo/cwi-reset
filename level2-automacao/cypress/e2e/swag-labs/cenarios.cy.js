/// <reference types="cypress" />
import SwagPage from "../../pages/swag-page.js";
import SwagProducts from "../../pages/swag-products.cy.js";
import SwagCart from "../../pages/swag-cart.js";
import SwagInfoPage from "../../pages/swag-infopage.js";
import SwagCheckout from "../../pages/swag-checkout.js";
import SwagOrderCompleted from "../../pages/swag-ordercompleted.js";

const swagPage = new SwagPage()
const swagProducts = new SwagProducts()
const swagCart = new SwagCart()
const swagInfoPage = new SwagInfoPage()
const swagCheckout = new SwagCheckout()
const swagOrderCompleted = new SwagOrderCompleted()


describe('Swag Labs', () => {

    beforeEach (() => {
        swagPage.acessar()
    })

    it('Deve acessar o swaglabs com sucesso', () => {
        cy.url().should('include', 'saucedemo')
       })

    it('Deve tentar acessar sem Username', () => {
        swagPage.clicarLogin()
        swagPage.pegarErro().should('have.text','Epic sadface: Username is required')
        })

    it('Deve tentar login sem senha', () => {
        swagPage.loginStandardUser('standard_user','{enter}')
        cy.pegarErro().should('have.text','Epic sadface: Password is required')
    })

    it('Deve tentar login sem sucesso', () => {
        swagPage.loginStandardUser('standard_user','a')
        cy.pegarErro().should('have.text','Epic sadface: Username and password do not match any user in this service')
    })

    it('Deve fazer login com Standard User', () => {
        swagPage.loginStandardUser('standard_user','secret_sauce')
        cy.url().should('include', 'saucedemo.com/inventory.html')
        cy.get('.title').should('have.text', 'Products')
        //cy.pegarErro().should('have.text','Epic sadface: Username and password do not match any user in this service')
    })
    
    it('Deve fazer login com Problem User', () => {
        cy.loginProblemUser()
        //cy.url().should('include', 'saucedemo.com/inventory')
        //cy.get('.title').should('have.text', 'Products')
        //cy.pegarErro().should('have.text','Epic sadface: Username and password do not match any user in this service')
    })
    
    it('Deve fazer login com LockedOut User', () => {
        cy.loginLockedOutUser()
        cy.pegarErro().should('have.text','Epic sadface: Sorry, this user has been locked out.')
    })

    it('Deve fazer login com PerformanceGlitch User', () => {
        cy.loginPerformanceGlitchUser()
        //cy.pegarErro().should('have.text','Epic sadface: Sorry, this user has been locked out.')
    })

    it('Deve adicionar Jaqueta ao carrinho', () => {
        cy.loginStandardUser()
        cy.get('#item_5_title_link > .inventory_item_name').should('have.text','Sauce Labs Fleece Jacket')
        cy.get('#item_5_title_link > .inventory_item_name').click()
        cy.get('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click()
        //cy.get('[data-test="back-to-products"]').click()
        //cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
        cy.get('.shopping_cart_link').click()
        cy.get('.cart_item').should('have.length', '1')
        cy.get('#item_5_title_link > .inventory_item_name').should('have.text','Sauce Labs Fleece Jacket')

    })
    
    it('Deve adicionar 2 itens ao carrinho', () => {
        cy.loginStandardUser()
        cy.get('#item_5_title_link > .inventory_item_name').should('have.text','Sauce Labs Fleece Jacket')
        cy.get('#item_5_title_link > .inventory_item_name').click()
        cy.get('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click()
        cy.get('[data-test="back-to-products"]').click()
        cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
        cy.get('.shopping_cart_link').click()
        cy.get('.cart_item').should('have.length', '2')
        cy.get('#item_5_title_link > .inventory_item_name').should('have.text','Sauce Labs Fleece Jacket')

    })

    it.only('Finaliza um Pedido', () => {
        swagPage.loginStandardUser('standard_user','secret_sauce')
        swagProducts.addJaquetaCarrinho()
        swagProducts.visualizarCarrinho()
        swagCart.checkout()
        swagInfoPage.adicionarInfos()
        swagCheckout.finalizarCompra()
        swagOrderCompleted.pedidoFeito()
    })
})
