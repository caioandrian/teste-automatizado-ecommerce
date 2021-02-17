// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('fazerLogin', (email, senha) => {
    if(email != ' '){
        cy.get('#email').clear().type(email);
    }else
        cy.get('#email').focus().blur()

    if(senha != ' '){
        cy.get('#passwd').clear().type(senha);
    }else
        cy.get('#passwd').focus().blur()

    cy.get('#SubmitLogin').click();
})

Cypress.Commands.add('pesquisarUmProduto', (nome) => {
    if(nome != ' '){
        cy.get('#searchbox').find('#search_query_top').clear().type(nome);
    }else
        cy.get('#searchbox').find('#search_query_top').focus().blur()

    cy.get('#searchbox').find('[name=submit_search]').click();
})

Cypress.Commands.add('navegarPorMenuSuperiorCategorias', (categoria) => {
    cy.get('#block_top_menu').contains(categoria).click({force: true});
})

Cypress.Commands.add('visualizarProdutoByQuickView', (posicao) => {
    cy.get('[class=quick-view]')
    .find('span')
    .contains('Quick view').eq(posicao)
    .click({force: true});
})

Cypress.Commands.add('adicionarProdutoNoCarrinho_telaInicial', (posicao) => {
    cy.get('[class=product-container]').eq(posicao)
    .trigger('mouseover')
    .contains('Add to cart')
    .click();
})

Cypress.Commands.add('selecionarCorDoProduto', (posicao, posicao_cor) => {
    cy.get('[class="product_list grid row"]')
        .find('li').eq(posicao)
        .find('[class="color_to_pick_list clearfix"]')
        .find('a').eq(posicao_cor).click({force: true})
})

Cypress.Commands.add('diminuirQuantidadeDoItem_telaMeuCarrinho', (posicao) => {
    cy.get('#cart_summary').find('tbody tr').find('td').eq(4)
        .find('a').eq(0)
        .click();
})

Cypress.Commands.add('aumentarQuantidadeDoItem_telaMeuCarrinho', (posicao) => {
    cy.get('#cart_summary').find('tbody tr').find('td').eq(4)
        .find('a').eq(1)
        .click();
})

Cypress.Commands.add('removerItemDoCarrinho_telaMeuCarrinho', (posicao) => {
    cy.get('[data-title=Delete]').eq(posicao).click();
})

Cypress.Commands.add('removerItemDoCarrinho_ajax', (posicao) => {
    cy.get('[class=ajax_cart_block_remove_link]').click()
})

Cypress.Commands.add('getIframeBody', () => {
    // get the iframe > document > body
    // and retry until the body element is not empty
    return cy
    .get('iframe[class=fancybox-iframe]')
    .its('0.contentDocument.body', {timeout: 10000}).should('not.be.empty')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    // https://on.cypress.io/wrap
    .then(cy.wrap)
})