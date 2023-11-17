describe("API Test", () => {
	it("Test /api/pokemon/random endpoint", () => {
		for (let i = 0; i < 10; i++) {
			cy.request("http://localhost:3000/api/pokemon/random").then(
				(response) => {
					expect(response.status).to.eq(200);
					expect(response.body[0]).to.have.property("img_url");
					expect(response.body[0]).to.have.property("index");
					expect(response.body[0]).to.have.property("name");
					expect(response.body[0]).to.have.property("stats");
					expect(response.body[0]).to.have.property("types");
					expect(response.body[0]).to.have.property("url");
				}
			);
		}
	});
});
