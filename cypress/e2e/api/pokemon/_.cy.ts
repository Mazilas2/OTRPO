describe("GET /api/pokemon/", () => {
	it("should return a pokemon with valid id", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/?id=1",
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body[0]).to.have.property("name");
			expect(response.body[0]).to.have.property("types");
			expect(response.body[0]).to.have.property("stats");
		});
	});

	it("should return an error with invalid id", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/?id=0",
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body).to.have.property("error");
			expect(response.body.error).to.eq("Не указан id");
		});
	});

	it("should return an error with non-existent id", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/?id=999999",
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body).to.have.property("error");
			expect(response.body.error).to.eq(
				"Покемона с таким id не существует"
			);
		});
	});
});
