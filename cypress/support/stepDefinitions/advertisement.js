import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import advertisement from '../../integration/pages/advertisementPage'
import { URL, LABEL } from '../constants';

const advertisementPage = new advertisement();
let getListResponse;

Given('I navigate to the advertisements page', () => {
    cy.visit(URL.ADVERTISEMENTS);
})

Given('I navigate to the existing advertisement page', () => {
    createAdvertisementViaApi();
    cy.get("@advertisementId").then(id => {
        cy.visit(URL.ADVERTISEMENT + '/' + id + '/edit')
    })
})

When('I create new advertisement', () => {
    createNewAdvertisement();
})

When('I edit the existing advertisement', () => {
    editExistingAdvertisement();
})

Then('I see the edited changes reflected in the advertisement', () => {
    verifyEditedAdvertisement();
})

Then('I see the advertisement displayed', () => {
    verifyNewlyCreatedAdvertisement();

})

function createAdvertisementViaApi() {
    cy.fixture('createAdvertisement').then((requestPayload) => {
        createNewAdvertisementViaApi(requestPayload).then(response => {
            cy.wrap(response.body._id).as("advertisementId")
        })
    })
}

function verifyEditedAdvertisement() {
    cy.get("@advertisementId").then(id => {
        getAdvertisementDetails(id).then(response => {
            cy.fixture('editAdvertisement').then((advertisement) => {
                expect(response.body.name).to.equal(advertisement.data.name);
                expect(response.body.street).to.equal(advertisement.data.street);
                const rooms = Number(advertisement.data.rooms)
                expect(response.body.rooms).to.equal(rooms);
                expect(response.body.price).to.equal(advertisement.data.price);
                expect(response.body.status).to.equal(advertisement.data.status);
            })

        })
    })
}

function verifyNewlyCreatedAdvertisement() {
    cy.wait('@interceptCreateNewAdvertisementApi').then(xhr => {
        expect(xhr.response.statusCode).to.equal(200);
        cy.wrap(xhr.response.body._id).as("newAdvertisementId")
        cy.get("@newAdvertisementId").then(id => {
            getAdvertisementDetails(id).then(response => {
                cy.wrap(response.body).as("advertisementDetailedResponse");
                getListResponse = [
                    {
                        "name": response.body.name,
                        "street": response.body.street,
                        "rooms": response.body.rooms,
                        "price": response.body.price,
                        "status": response.body.status,
                        "_id": id

                    }

                ]

                interceptGetAllAdvertisements(getListResponse)
            })


        })
        verifyAdvertisement(xhr);
    })
    cy.reload();
    cy.wait("@interceptGetAllAdvertisements")
    verifyAdvertisementPageHeaders();
    verifyAdvertisementRecord();

}

function verifyAdvertisementRecord() {
    cy.get('tbody tr').within(() => {
        cy.fixture('createAdvertisement').then((advertisement) => {
            cy.get('td').contains(advertisement.data.name)
            cy.get('td').contains(advertisement.data.street)
            cy.get('td').contains(advertisement.data.rooms)
            cy.get('td').contains(advertisement.other.price)
            cy.get('td').contains(advertisement.other.status)
        })

    })

}

function verifyAdvertisement(xhr) {
    cy.get("@newAdvertisementId").then(id => {
        cy.fixture('createAdvertisement').then((advertisement) => {
            expect(xhr.response.body._id).to.equal(id);
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.response.body.name).to.equal(advertisement.data.name);
            expect(xhr.response.body.street).to.equal(advertisement.data.street);
            const totalRooms = Number(advertisement.data.rooms)
            expect(xhr.response.body.rooms).to.equal(totalRooms);
            expect(xhr.response.body.price).to.equal(advertisement.data.price);
            expect(xhr.response.body.status).to.equal(advertisement.data.status);
        })
    })
}

function verifyAdvertisementPageHeaders() {
    cy.get('table thead').within(() => {
        cy.get('th').contains(LABEL.ADVERTISEMENT_NAME)
        cy.get('th').contains(LABEL.STREET)
        cy.get('th').contains(LABEL.ROOMS)
        cy.get('th').contains(LABEL.PRICE)
        cy.get('th').contains(LABEL.STATUS)
    })

}

function createNewAdvertisement() {
    /*Note:- Intercepting Create Advertisement API below so that I can mock and render 
    only this response on the advertisements page after creation for assertion
    */
    interceptCreateNewAdvertisementApi();
    cy.fixture('createAdvertisement').then((advertisement) => {
        advertisementPage.addBtn().click()
        advertisementPage.name().type(advertisement.data.name);
        advertisementPage.street().type(advertisement.data.street);
        advertisementPage.rooms().type(advertisement.data.rooms);
        advertisementPage.price().type(advertisement.data.price);
        advertisementPage.status().click();
        advertisementPage.save().click();
    })
}

/* Note:- To edit an existing advertisement we can follow two approaches
Approach 1:- Using deeplinking navigate to existing advertisement details page
Approach 2:- Using request mocking via cy.intercept function
Initially I had implemeted using request mocking below. Hence still kept the code if deeplinking not supported
by application
*/

function editExistingAdvertisementViaRequestMocking() {
 cy.fixture('createAdvertisement').then((requestPayload) => {
        createNewAdvertisementViaApi(requestPayload).then(response => {
            cy.wrap(response.body._id).as("advertisementId")

        })
    })

    cy.get("@advertisementId").then(id => {
        advertisementDetails(id)
    })

    cy.get('tbody tr').eq(0).click()
    cy.wait("@viewAdvertisementDetails")
    cy.fixture('editAdvertisement').then((advertisement) => {
        advertisementPage.name().clear().type(advertisement.data.name);
        advertisementPage.street().clear().type(advertisement.data.street);
        advertisementPage.rooms().clear().type(advertisement.data.rooms);
        advertisementPage.price().clear().type(advertisement.data.price);
        advertisementPage.status().click();
        advertisementPage.save().click();
    })

}

function editExistingAdvertisement() {
    cy.fixture('editAdvertisement').then((advertisement) => {
        advertisementPage.name().clear().type(advertisement.data.name);
        advertisementPage.street().clear().type(advertisement.data.street);
        advertisementPage.rooms().clear().type(advertisement.data.rooms);
        advertisementPage.price().clear().type(advertisement.data.price);
        advertisementPage.status().click();
        advertisementPage.save().click();
    })
}

function interceptCreateNewAdvertisementApi() {
    cy.intercept({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/advertisements`,
    }).as("interceptCreateNewAdvertisementApi")

}

function interceptGetAllAdvertisements(response) {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/advertisements`,
        {
            body: response
        }
    ).as("interceptGetAllAdvertisements")

}

function advertisementDetails(id) {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/advertisements/*`,
        (req) => {
            req.url = `${Cypress.config('baseUrl')}/api/advertisements/${id}`
        })
        .as("viewAdvertisementDetails")

}

function getAdvertisementDetails(id) {
    return cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/advertisements/${id}`,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

function createNewAdvertisementViaApi(payload) {
    return cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/api/advertisements`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload.data,
    })

}
