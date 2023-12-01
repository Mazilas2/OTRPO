describe("GET /api/pokemon/getId", () => {
	it("should return a pokemon id with valid name", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/getId?name=bulbasaur",
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("id");
		});
	});

	it("should return an error with invalid name", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/getId?name=invalidname",
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body).to.have.property("error");
			expect(response.body.error).to.eq("Покемон не найден");
		});
	});

	it("should return an error with no name provided", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/getId",
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body).to.have.property("error");
			expect(response.body.error).to.eq("Не указано имя");
		});
	});
});
