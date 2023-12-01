describe("GET /api/pokemon/list", () => {
	it("should return a list of pokemons with valid search query", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/list?filters=bulb",
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("count");
			expect(response.body).to.have.property("num_pages");
			expect(response.body).to.have.property("data");
			expect(response.body).to.have.property("page");
			expect(response.body).to.have.property("search_query");
		});
	});

	it("should return a list of pokemons with valid page number", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/list?page=2",
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("count");
			expect(response.body).to.have.property("num_pages");
			expect(response.body).to.have.property("data");
			expect(response.body).to.have.property("page");
			expect(response.body).to.have.property("search_query");
		});
	});

	it("should return a list of pokemons with valid search query and page number", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/list?filters=bulb&page=2",
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("count");
			expect(response.body).to.have.property("num_pages");
			expect(response.body).to.have.property("data");
			expect(response.body).to.have.property("page");
			expect(response.body).to.have.property("search_query");
		});
	});

	it("should return a list of all pokemons with no search query and page number", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/pokemon/list",
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("count");
			expect(response.body).to.have.property("num_pages");
			expect(response.body).to.have.property("data");
			expect(response.body).to.have.property("page");
			expect(response.body).to.have.property("search_query");
		});
	});
});
