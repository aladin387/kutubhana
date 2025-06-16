
			const API_URL = "http://localhost:8080/api/korisnici";

			function ucitajKorisnike() {
				return fetch(API_URL)
					.then(res => res.json())
					.then(data => {
						const tbody = document.querySelector("#listaKorisnika tbody");
						tbody.innerHTML = "";

						data.forEach(korisnik => {
							const row = document.createElement("tr");

							row.innerHTML = `
								<td>${korisnik.id}</td>
								<td class="username">${korisnik.username}</td>
								<td class="akcije">
									<button class="btn-obrisi" onclick="obrisiKorisnika(${korisnik.id})">Obriši</button>
									<button class="btn-izmijeni" onclick="toggleIzmjena(this, ${korisnik.id})">Izmijeni</button>
								</td>
							`;

							tbody.appendChild(row);
						});
					});
			}


			function dodajKorisnika() {
				const username = document.getElementById("username").value.trim();

				if (!username) {
					alert("Ime korisnika je obavezno");
					document.getElementById("username").focus(); // korisnik vidi gdje treba da upiše
					return;
				}

				const korisnik = { username };


				fetch(API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(korisnik)
				})
				.then(() => {
					ucitajKorisnike();
					document.getElementById("username").value = "";
					document.getElementById("btnPrikaziFormu").textContent = "DODAJ KORISNIKA";
				});
				
				zatvoriFormu();
			}
			
			//da se dodaje sa enterom
			["username"].forEach(id => {
				document.getElementById(id).addEventListener("keydown", function (event) {
					if (event.key === "Enter") {
						event.preventDefault();
						dodajKorisnika();
					}
				});
			});
			
			
			function obrisiKorisnika(id) {
				// Prvo pitamo za potvrdu brisanja
				const potvrda = window.confirm("Da li ste sigurni da želite obrisati korisnika?");
				if (potvrda) {
					// Ako je korisnik kliknuo OK, izvršavamo brisanje
					fetch(`${API_URL}/${id}`, { method: "DELETE" })
						.then(() => ucitajKorisnike());
				}
			}

			
			function toggleIzmjena(btn, id) {
				const tr = btn.closest("tr");
				const jeURezimIzmjene = btn.textContent === "Sačuvaj";

				if (!jeURezimIzmjene) {

					const username = tr.querySelector(".username").textContent;

					tr.querySelector(".username").innerHTML = `<input type="text" value="${username}" data-original="${username}">`;

					btn.textContent = "Sačuvaj";
					tr.querySelector(".username input").focus();

					tr.querySelectorAll("input").forEach(input => {
						input.addEventListener("keydown", function (event) {
							if (event.key === "Enter") {
								event.preventDefault();
								toggleIzmjena(btn, id);
							} else if (event.key === "Escape") {
								event.preventDefault();

								tr.querySelector(".username").textContent = username;
								
								btn.textContent = "Izmijeni";
							}
						});
					});
				} else {
					const noviKorisnik = {
						username: tr.querySelector(".username input").value.trim(),
					};

					fetch(`${API_URL}/${id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(noviKorisnik)
					})
					.then(response => {
						if (!response.ok) throw new Error("Greška pri izmjeni korisnika.");
						return response.json();
					})
					.then(data => {
						tr.querySelector(".username").textContent = data.username;

						btn.textContent = "Izmijeni";
						alert("Korisnik je uspješno izmijenjen.");
					})
					.catch(err => {
						console.error(err);
						alert("Ime i prezime su obavezni.");
					});
				}
			}
			
			
			function filterUsers() {
				const input = document.getElementById("searchInput").value.toLowerCase();
				const table = document.getElementById("listaKorisnika");
				const rows = table.getElementsByTagName("tr");

				for (let i = 1; i < rows.length; i++) { // i = 1, da preskoči header
					const cells = rows[i].getElementsByTagName("td");
					let matchFound = false;

					for (let j = 0; j < cells.length; j++) {
						const cellContent = cells[j].textContent.toLowerCase();
						if (cellContent.includes(input)) {
							matchFound = true;
							break;
						}
					}

					rows[i].style.display = matchFound ? "" : "none";
				}
			}					
			
			
						// Selektujemo dugmad i modal
			const btnPrikaziFormu = document.getElementById("btnPrikaziFormu");
			const modal = document.getElementById("modal");
			const zatvoriModal = document.getElementById("zatvoriModal");
			const btnOtkaziDodavanje = document.getElementById("btnOtkaziDodavanje");

			// Funkcija za prikaz modala
			function prikaziFormu() {
				modal.style.display = "flex";
				document.getElementById("username").focus();

			}

			// Funkcija za zatvaranje modala
			function zatvoriFormu() {
			  modal.style.display = "none";
			  // Po želji, možeš i obrisati input polje kad zatvoriš formu
			  document.getElementById("username").value = "";
			}

			// Event listeneri za otvaranje i zatvaranje modala
			btnPrikaziFormu.addEventListener("click", prikaziFormu);
			zatvoriModal.addEventListener("click", zatvoriFormu);
			btnOtkaziDodavanje.addEventListener("click", zatvoriFormu);


			window.addEventListener("keydown", (event) => {
			  if (event.key === "Escape" && modal.style.display === "flex") {
				zatvoriFormu();
			  }
			});

			window.addEventListener("click", (event) => {
			  if (event.target === modal) {
				zatvoriFormu();
			  }
			});

			
			document.addEventListener("DOMContentLoaded", async () => {
				const modal = document.getElementById("userModal");
				modal.style.display = "none";

				await ucitajKorisnike(); // čekamo da se tabela popuni
				
				
				
				fetch("http://localhost:8080/api/zaduzenja/aktivni-korisnici")
					.then(response => response.json())
					.then(data => {
						const zaduzeniKorisnici = data;
						const rows = document.querySelectorAll("#listaKorisnika tbody tr");

						rows.forEach(row => {
							const userId = row.cells[0].textContent.trim();
							const usernameCell = row.cells[1];

							const isZaduzen = zaduzeniKorisnici.some(korisnik => korisnik.id == userId);

							if (isZaduzen) {
								usernameCell.classList.add("korisnik-zaduzen");
								usernameCell.title = "📚 Ima zaduženu knjigu";
							} else {
								usernameCell.classList.remove("korisnik-zaduzen");
								usernameCell.title = "";
							}

							usernameCell.style.cursor = "pointer";

							usernameCell.addEventListener("click", () => {
								document.getElementById("modalTitle").textContent = `Korisnik: ${usernameCell.textContent}`;
								document.getElementById("modalInfo").textContent = isZaduzen
									? "📚 Trenutno ima zaduženu knjigu!"
									: "✔ Nema aktivnih zaduženja.";

								setTimeout(() => {
									modal.style.display = "block";
								}, 50);
							});
						});
					})
					.catch(error => console.error("Greška pri dohvaćanju aktivnih korisnika:", error));

				
				
				
				// Modal zatvaranje
				document.querySelector(".close").addEventListener("click", () => {
					modal.style.display = "none";
				});

				window.addEventListener("keydown", (event) => {
					if (event.key === "Escape") {
						document.getElementById("userModal").style.display = "none";
					}
				});

			});