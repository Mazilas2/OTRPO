describe("template spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:3000/Home");
		cy.get("div").should("have.class", "select-btn");
		cy.get("div.select-btn button").click({ multiple: true });
		cy.get("a").contains("Бой").click();
		cy.visit("http://localhost:3000/Fight");
		// Get div with class my-pokemon
		cy.get("div").should("have.class", "my-pokemon");
		// Check if there img with id my-pokemon
		cy.get("img").should("have.id", "my-pokemon");
		// Check if my-pokemon and enemy-pokemon are not the same image
		cy.get("img#my-pokemon").should("not.be.equal", "img#enemy-pokemon");
		cy.get("#fight-input").then(($input) => {
			// Generate a random number from 1 to 10
			const randomNum = Math.floor(Math.random() * 10) + 1;
			// Set the random number as the value of the input field
			cy.wrap($input).type(randomNum.toString());
		});

		cy.wait(1000).then(() => {
			for (var i = 0; i < 5; i++) {
				let hp_my = cy.get("span#hp-count-my-current").eq(0);
				let hp_enemy = cy.get("span#hp-count-my-current").eq(1);
				cy.get("#fight-btn").click();
				hp_my.invoke("text").then((text: string) => {
					console.log(text);
					if (text == "0") {
						i += 5;
						console.log(i);
					}
				});

				hp_enemy.invoke("text").then((text: string) => {
					console.log(text);
					if (text == "0") {
						i += 5;
						console.log(i);
					}
				});
				cy.wait(1000);
			}
		});
	});
});
