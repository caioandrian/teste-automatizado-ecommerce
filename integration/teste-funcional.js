/// <reference types="cypress" />

import '../support/commands'

describe('Cypress Testes Funcionais - Ecommerce', () => {
    beforeEach(() => {
        cy.visit()

        //layout responsivo irá esconder o botao
        cy.viewport(1201, 768)
    })

    //REQUISITOS FUNCIONAIS DO E-COMMERCE

    it('Deve pesquisar por um produto', () => {
        //entradas inválidas
        cy.pesquisarUmProduto(' ');
        cy.contains('Please enter a search keyword').should('be.visible');

        cy.pesquisarUmProduto('as_4334@!#%#@.');
        cy.contains('No results were found for your search').should('be.visible');
        
        //entrada válida
        cy.pesquisarUmProduto('Dress');
        cy.contains('No results were found for your search').should('not.exist');
    })

    it('Deve adicionar um produto no carrinho ("via tela inicial")', () => {
        cy.adicionarProdutoNoCarrinho_telaInicial(0);

        cy.get('#layer_cart', { timeout: 10000 }).should('be.visible')
        .and('contain', 'Product successfully added to your shopping cart')
        cy.get('[class=cross]', {timeout: 10000}).click()

        cy.contains('Cart').trigger('mouseover', {timeout: 6000})
        cy.get('[class=cart_block_list]').find('dt').should('have.length', 1)
    })

    it('Deve concluir um pedido de compra', () => {
        //fazer login
        cy.contains('Sign in').click();
        cy.fazerLogin('tester12345@gmail.com','teste12345');
        cy.contains('Tester abc').should('be.visible')

        //adicionar produto no carrinho
        cy.get('#header_logo').click();
        cy.adicionarProdutoNoCarrinho_telaInicial(0);

        cy.get('#layer_cart', { timeout: 10000 }).should('be.visible')
        .and('contain', 'Product successfully added to your shopping cart')

        cy.contains('Proceed to checkout').click();
        cy.get('#cart_title').should('contain.text', 'Shopping-cart summary')
        
        //next
        cy.visit("http://automationpractice.com/index.php?controller=order&step=1", {timeout: 10000})
        
        //estar logado ou fazer login
        
        //endereço deve estar selecionado
        cy.get('#addressesAreEquals').should('be.checked')

        cy.get('[name=processAddress]').click({force:true});

        //forma de envio deve estar selecionado
        cy.get('[class=delivery_option_radio]').should('be.checked')

        //concordar com os termos 
        //entrada inválida
        cy.get('[name=processCarrier]').click({force:true});
        cy.contains('You must agree to the terms of service before continuing').should('be.visible');
        cy.get('[class="fancybox-item fancybox-close"]').click();
    
        //entrada válida
        cy.get('#cgv').click().should('be.checked')
        cy.get('[name=processCarrier]').click({force:true});

        //selecionar forma de pagamento
        cy.get('#HOOK_PAYMENT').find('a').eq(1).click()

        cy.get('#cart_navigation')
            .find('button')
            .click({force:true});

        //Compra finalizada
        cy.contains('Your order on My Store is complete.').should('be.visible')
        cy.contains('Your order will be sent as soon as we receive your payment.').should('be.visible')
    })

    //REQUISITOS FUNCIONAIS LOGIN DO CLIENTE

    it('Deve fazer login', () => {
        cy.contains('Sign in').click();

        //entradas inválidas
        cy.fazerLogin(' ',' ');
        cy.contains('An email address required.').should('be.visible')

        cy.fazerLogin('%$#_423432asdasd*',' ');
        cy.contains('Invalid email address.').should('be.visible')

        cy.fazerLogin('%$#_423432asdasd*@*',' ');
        cy.contains('Invalid email address.').should('be.visible')

        cy.fazerLogin('as1@',' ');
        cy.contains('Invalid email address.').should('be.visible')

        cy.fazerLogin('tester12345@gmail.com',' ');
        cy.contains('Password is required.').should('be.visible')

        cy.fazerLogin('tester12345@gmail.com','$$#_*125dsd');
        cy.contains('Authentication failed.').should('be.visible')
        
        //entrada válida
        cy.fazerLogin('tester12345@gmail.com','teste12345');
        cy.contains('Tester abc').should('be.visible')

        cy.contains('Sign out').click();
    })

    //TODO REQUISITOS FUNCIONAIS TELA DO CLIENTE
    //VISUALIZAR DADOS DA MINHA COMPRA
})