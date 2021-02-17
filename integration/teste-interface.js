/// <reference types="cypress" />

import '../support/commands'

describe('Cypress Testes De Interface - Ecommerce', () => {
    beforeEach(()=>{
        cy.visit()

        //layout responsivo irá esconder o botao
        cy.viewport(1201, 768)
    })

    //NAVEGAÇÃO

    it('Deve continuar comprando (após adicionar o produto via tela inicial)', () => {
        cy.adicionarProdutoNoCarrinho_telaInicial(0);
        cy.get('#layer_cart', { timeout: 10000 }).should('be.visible');

        cy.contains('Continue shopping').click();
        cy.get('#layer_cart', { timeout: 10000 }).should('not.be.visible');
    })

    it('Deve prosseguir para o checkout (após adicionar o produto no carrinho via tela inicial)', () => {
        cy.adicionarProdutoNoCarrinho_telaInicial(0);
        cy.get('#layer_cart', { timeout: 10000 }).should('be.visible');

        cy.contains('Proceed to checkout').click();
        cy.get('#cart_title').should('contain.text', 'Shopping-cart summary')
    })

    it('Deve prosseguir para o checkout (após clicar ajax do meu carrinho)', () => {
        cy.adicionarProdutoNoCarrinho_telaInicial(0);
        cy.get('[class=cross]', {timeout: 10000}).click()

        cy.contains('Cart').trigger('mouseover', {timeout: 6000})
        cy.get('#button_order_cart').click();

        cy.get('#cart_title').should('contain.text', 'Shopping-cart summary')
    })

    it('Deve filtrar por categoria (Mulheres)', () => {
        cy.navegarPorMenuSuperiorCategorias('Women')

        cy.get('#categories_block_left')
            .find('[class=title_block]')
            .should('contain', 'Women')

        cy.get('#center_column')
            .find('[class=content_scene_cat_bg]')
            .find('[class=category-name]')
            .should('contain', 'Women')

        cy.get('#center_column')
            .find('[class="page-heading product-listing"]')
            .find('[class=cat-name]')
            .should('contain', 'Women')

        cy.get('[class="breadcrumb clearfix"]').should('contain', 'Women')
    })

    it('Deve filtrar por categoria (T-shirts)', () => {
        cy.navegarPorMenuSuperiorCategorias('T-shirts')

        cy.get('#center_column')
            .find('[class=content_scene_cat_bg]')
            .find('[class=category-name]')
            .should('contain', 'T-shirts')

        cy.get('#center_column')
            .find('[class="page-heading product-listing"]')
            .find('[class=cat-name]')
            .should('contain', 'T-shirts')

        cy.get('[class="breadcrumb clearfix"]').should('contain', 'T-shirts')
        cy.get('[itemprop=name]').find('a').should('contain', 'T-shirts')
    })

    it('Deve filtrar por categoria (Vestidos)', () => {
        cy.navegarPorMenuSuperiorCategorias('Dresses')
        
        cy.get('#categories_block_left')
            .find('[class=title_block]')
            .should('contain', 'Dresses')

        cy.get('#center_column')
            .find('[class=content_scene_cat_bg]')
            .find('[class=category-name]')
            .should('contain', 'Dresses')

        cy.get('#center_column')
            .find('[class="page-heading product-listing"]')
            .find('[class=cat-name]')
            .should('contain', 'Dresses')

        cy.get('[class="breadcrumb clearfix"]').should('contain', 'Dresses')
        cy.get('[itemprop=name]').find('a').should('contain', 'Dress')
    })

    // PRODUTO

    it('Deve apresentar o produto com a cor selecionada previamente', () => {
        cy.navegarPorMenuSuperiorCategorias('Women')

        cy.selecionarCorDoProduto(0, 1)
            .then(($elem) => {
                let style = $elem.attr( "style" )
                //console.log($elem);
            
                cy.get('#color_to_pick_list')
                    .find('[class=selected] a')
                    .should('have.attr', 'style', style)
            })
    })

    it('Deve apresentar o produto selecionado pelo botão quick view', () => {
        cy.visualizarProdutoByQuickView(0)
        
        cy.get('[class=fancybox-iframe]', {timeout: 10000}).then(iframe => {
            const body_iframe = iframe.contents().find('body')

            //variável body dentro do iframe precisa ser gerenciada pelo cypress
            cy.wrap(body_iframe, {timeout: 10000})
                .should('be.visible')
        })
    })

    it('Deve adicionar item no carrinho (após abrir o quick view)', () => {
        cy.visualizarProdutoByQuickView(0)
        cy.getIframeBody().contains('Add to cart').click({force: true});

        cy.get('#layer_cart', { timeout: 10000 }).should('be.visible')
        .and('contain', 'Product successfully added to your shopping cart')
        cy.get('[class=cross]', {timeout: 10000}).click()
    })

    // AJAX MEU CARRINHO

    it('Deve apresentar um item no carrinho (ajax do meu carrinho)', () => {
        cy.adicionarProdutoNoCarrinho_telaInicial(0);
        cy.get('[class=cross]', {timeout: 10000}).click()

        cy.contains('Cart').trigger('mouseover', {timeout: 6000})

        cy.get('[class=cart_block_list]').find('dt').should('have.length', 1)
    })

    it('Deve remover item do carrinho (ajax do meu carrinho)', () => {
        cy.adicionarProdutoNoCarrinho_telaInicial(0);
        cy.get('[class=cross]', {timeout: 10000}).click()

        cy.contains('Cart').trigger('mouseover', {timeout: 6000})

        cy.get('[class=cart_block_list]').find('dt').should('have.length', 1)
        cy.removerItemDoCarrinho_ajax()
        cy.get('[class=cart_block_list]').find('dt').should('have.length', 0)
        cy.get('[class=ajax_cart_no_product]').should('be.visible').and('have.text', '(empty)');
    })

    // MEU CARRINHO

    it('Deve alterar a quantidade do item no carrinho (tela meu carrinho)', () => {
        cy.adicionarProdutoNoCarrinho_telaInicial(0);
        cy.get('#layer_cart', { timeout: 10000 }).should('be.visible');

        cy.contains('Proceed to checkout').click();
        cy.get('#cart_title').should('contain.text', 'Shopping-cart summary')

        cy.get('#cart_summary').find('tbody tr').should('have.length.at.least', 1)

        cy.get('#cart_summary').find('tbody tr').find('td').eq(4)
            .find('[class="cart_quantity_input form-control grey"]')
            .should('have.value', 1)

        cy.aumentarQuantidadeDoItem_telaMeuCarrinho();

        cy.get('#cart_summary').find('tbody tr').find('td').eq(4)
            .find('[class="cart_quantity_input form-control grey"]')
            .should('have.value', 2)

        cy.diminuirQuantidadeDoItem_telaMeuCarrinho();

        cy.get('#cart_summary').find('tbody tr').find('td').eq(4)
            .find('[class="cart_quantity_input form-control grey"]')
            .should('have.value', 1)
    })

    it('Deve atualizar o valor da compra (tela meu carrinho)', () => {
        //alterar quantidade do item ou excluir um item
        cy.adicionarProdutoNoCarrinho_telaInicial(0);
        cy.get('#layer_cart', { timeout: 10000 }).should('be.visible');

        cy.contains('Proceed to checkout').click();
        cy.get('#cart_title').should('contain.text', 'Shopping-cart summary')

        cy.get('#cart_summary').find('tbody tr').should('have.length.at.least', 1)

        cy.get('#cart_summary').find('tbody tr').find('td').eq(4)
            .find('[class="cart_quantity_input form-control grey"]')
            .should('have.value', 1)

        cy.get('#cart_summary').find('tbody tr').find('td').eq(3)
            .find('span').eq(1)
            .invoke('text')
                .then(($elem) => {
                    let valorProduto = parseFloat($elem.replace('$', ''))

                    cy.aumentarQuantidadeDoItem_telaMeuCarrinho()
                    
                    cy.get('#total_product', {timeout: 10000}).should('not.have.text', $elem)
                    
                    cy.get('#total_product').invoke('text').then(($elem2) => {
                        let valorTotal = parseFloat($elem2.replace('$', ''))

                        expect(valorTotal).to.be.eq(valorProduto * 2)
                    })
                    
                })
    })

    it('Deve remover item do carrinho (tela meu carrinho)', () => {
        cy.adicionarProdutoNoCarrinho_telaInicial(0);
        cy.get('#layer_cart', { timeout: 10000 }).should('be.visible');

        cy.contains('Proceed to checkout').click();
        cy.get('#cart_title').should('contain.text', 'Shopping-cart summary')

        cy.get('#cart_summary').find('tbody tr').should('have.length.at.least', 1)
        cy.removerItemDoCarrinho_telaMeuCarrinho(0);
        cy.contains('Your shopping cart is empty.').should('be.visible');
    })

})