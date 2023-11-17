describe("API Test", () => {
	it("Test /api/fight/fast endpoint", () => {
		cy.request({
			method: "GET",
			url: "http://localhost:3000/api/fight/fast",
			qs: {
				usr_hp: 100,
				enm_hp: 100,
				usr_dmg: 10,
				enm_dmg: 10,
			},
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer your_token",
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("Winner");
			expect(["User", "Enemy"]).to.include(response.body.Winner);
		});
	});
});
