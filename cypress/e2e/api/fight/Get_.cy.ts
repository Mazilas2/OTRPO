describe("API Test", () => {
	it("Test /api/fight endpoint", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/fight",
			qs: {
				id_pokemon_user: 1,
				id_pokemon_enemy: 2,
			},
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer your_token",
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("pkmn_user");
			expect(response.body).to.have.property("pkmn_enemy");
			expect(response.body.pkmn_user[0]).to.have.property("img_url");
            expect(response.body.pkmn_user[0]).to.have.property("index");
            expect(response.body.pkmn_user[0]).to.have.property("name");
            expect(response.body.pkmn_user[0]).to.have.property("stats");
            expect(response.body.pkmn_user[0]).to.have.property("types");
            expect(response.body.pkmn_user[0]).to.have.property("url");
            expect(response.body.pkmn_enemy[0]).to.have.property("img_url");
            expect(response.body.pkmn_enemy[0]).to.have.property("index");
            expect(response.body.pkmn_enemy[0]).to.have.property("name");
            expect(response.body.pkmn_enemy[0]).to.have.property("stats");
            expect(response.body.pkmn_enemy[0]).to.have.property("types");
            expect(response.body.pkmn_enemy[0]).to.have.property("url");
		});
	});
});
