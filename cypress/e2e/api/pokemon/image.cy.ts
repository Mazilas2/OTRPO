describe("GET /api/pokemon/image", () => {
	it("should return a pokemon image url with valid name", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/image?name=bulbasaur",
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("img_url");
		});
	});

	it("should return an error with invalid name", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/image?name=invalidname",
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
			url: "http://localhost:3000/api/pokemon/image",
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body).to.have.property("error");
			expect(response.body.error).to.eq("Не указано имя");
		});
	});
});
