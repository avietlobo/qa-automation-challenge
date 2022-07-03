class advertisementPage {


    addBtn() {
        return cy.get('.al-card a md-icon')
    }

    name() {
        return cy.get("input[name='name']")
    }

    street() {
        return cy.get("input[name='street']")
    }

    rooms() {
        return cy.get("input[name='rooms']")
    }

    price() {
        return cy.get("input[name='price']")
    }

    status() {
        return cy.contains('Status').parent().parent()
    }

    save() {
        return cy.get('span').contains('save').parent('button')
    }


}

export default advertisementPage