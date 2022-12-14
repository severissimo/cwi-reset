/// <reference types="cypress">
import productCategoriesSchema from '../../contratos/categories'
import productCategoriesFixture from '../../fixtures/productCategoriesFixture.json'
import statusFixture from '../../fixtures/statusFixture.json'
import { faker } from '@faker-js/faker'


describe('Product Categories', () => {
    const categoryName = faker.commerce.department() + faker.commerce.department();

    it('GET - Listar todas as categorias - Aceitação', () => {
        cy.getProductCategoriesWooCommerce().should((response) => {
            expect(response.status).to.be.eq(statusFixture.ok)
            expect(response.body).to.have.length.greaterThan(0)
        })
    })

    it('GET - Lista todas as categorias - Contrato', () => {
        cy.getProductCategoriesWooCommerce()
            .should((response) => {
                for (let i = 0; i < response.body.length; i++) {
                    cy.validarArrayResponse(productCategoriesSchema, response.body[i])
                }
            })
    })

    it('POST - Cadastro de categorias - Aceitação', () => {
        cy.postProductCategoriesWooCommerce(categoryName, productCategoriesFixture.src)
            .should((response) => {
                expect(response.status).to.be.eq(statusFixture.created)
                expect(response.body.name).equals(categoryName)
                expect(response.body.image.src).contains(productCategoriesFixture.endSrc)
            }).then((response) => {
                cy.deleteProductCategoriesWooCommerce(response.body.id)
            })

    })

    it('POST - Cadastro de categorias - Contrato', () => {
        cy.postProductCategoriesWooCommerce(categoryName, productCategoriesFixture.src)
            .should((response) => {
                expect(response.status).to.be.eq(statusFixture.created)
            }).should((response) => {
                return productCategoriesSchema.validateAsync(response.body)
            }).then((response) => {
                cy.deleteProductCategoriesWooCommerce(response.body.id)
            })
    })

    it('PUT - Edição de categorias - Aceitação', () => {
        cy.postProductCategoriesWooCommerce(categoryName, productCategoriesFixture.src)
            .then((response) => {
                cy.putProductCategoriesWooCommerce(response.body.id, productCategoriesFixture.updatedDescription)
                .should((response) => {
                    expect(response.body.description).equals(productCategoriesFixture.updatedDescription)
                    expect(response.status).equals(statusFixture.ok)
                })
                cy.deleteProductCategoriesWooCommerce(response.body.id)
            })
    })

    it('PUT - Edição de categorias - Contrato', () => {
        cy.postProductCategoriesWooCommerce(categoryName, productCategoriesFixture.src)
            .then((response) => {
                cy.putProductCategoriesWooCommerce(response.body.id, productCategoriesFixture.updatedDescription)
                .should((response) => {
                    expect(response.status).equals(statusFixture.ok)
                    return productCategoriesSchema.validateAsync(response.body)
                })
                cy.deleteProductCategoriesWooCommerce(response.body.id)
            })
    })

    it('DELETE - Edição de categorias - Aceitação', () => {
        cy.postProductCategoriesWooCommerce(categoryName, productCategoriesFixture.src)
            .then((response) => {
                cy.deleteProductCategoriesWooCommerce(response.body.id)
                    .should((response) => {
                        expect(response.body.name).equals(categoryName)
                        expect(response.body.image.src).contains(productCategoriesFixture.endSrc)
                        expect(response.status).equals(statusFixture.ok)
                    })
            })
    }) 

    it('DELETE - Edição de categorias - Contrato', () => {
        cy.postProductCategoriesWooCommerce(categoryName, productCategoriesFixture.src)
            .then((response) => {
                cy.deleteProductCategoriesWooCommerce(response.body.id)
                    .should((response) => {
                        expect(response.status).equals(statusFixture.ok)
                        return productCategoriesSchema.validateAsync(response.body)
                    })
            })
    }) 
})  