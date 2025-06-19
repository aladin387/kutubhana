
			const API_URL = "http://localhost:8080/api/korisnici";
			
			let editKorisnikModUkljucen = false; // globalna varijabla da bi se u funkcijama za prikaz modula/prozora,  onemogućilo njihovo pojavljivanje dok traje editovanje


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

					editKorisnikModUkljucen = true;
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
								editKorisnikModUkljucen = false;

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
						editKorisnikModUkljucen = false;

					})
					.catch(err => {
						console.error(err);
						alert("Ime i prezime su obavezni.");
						editKorisnikModUkljucen = false;
					});
				}
			}
			
			
			function filterUsers() {
				const input = document.getElementById("searchInput").value.toLowerCase();
				const table = document.getElementById("listaKorisnika");
				const rows = table.getElementsByTagName("tr");

				for (let i = 1; i < rows.length; i++) { // i = 1, da preskoči header
					const cells = rows[i].getElementsByTagName("td");
					
					if (input === "") {
						// prikazuje sve kada se klikne na Escape
						rows[i].style.display = "";
						continue;
					}
					
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

			document.getElementById("searchInput").addEventListener("keydown", function (event) {
				if (event.key === "Escape") {
					this.blur();
					this.value = "";
					filterUsers();
				}
			});			
			
			
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
				// Sakrij modal za korisnika na početku
				const korisnikProzor = document.getElementById("korisnikProzor");
				korisnikProzor.style.display = "none";

				// Učitaj korisnike i popuni tabelu
				await ucitajKorisnike();

				// Dohvati aktivne zadužene korisnike s API-ja
				fetch("http://localhost:8080/api/zaduzenja/aktivni-korisnici")
					.then(response => response.json())
					.then(data => {
						const zaduzeniKorisnici = data;
						const rows = document.querySelectorAll("#listaKorisnika tbody tr");

						rows.forEach(row => {
							const userId = row.cells[0].textContent.trim();
							const usernameCell = row.cells[1];

							const isZaduzen = zaduzeniKorisnici.some(korisnik => korisnik.id == userId);

							// Dodaj klasu i tooltip ako je korisnik zadužen
							if (isZaduzen) {
								usernameCell.classList.add("korisnik-zaduzen");
								usernameCell.title = "📚 Ima zaduženu knjigu";
							} else {
								usernameCell.classList.remove("korisnik-zaduzen");
								usernameCell.title = "";
							}

							usernameCell.style.cursor = "pointer";

							// Event listener za otvaranje korisničkog modala
							usernameCell.addEventListener("click", () => {
								
								if (editKorisnikModUkljucen) return;
								
								const info = document.getElementById("korisnikInfo");
								const naslov = document.getElementById("korisnikNaslov");

								naslov.textContent = `Korisnik: ${usernameCell.textContent}`;
								info.innerHTML = isZaduzen
									? "📚 Trenutno ima zaduženu knjigu!"
									: "✔ Nema aktivnih zaduženja.";

								korisnikProzor.style.display = "flex";

								function escListener(e) {
									if (e.key === "Escape") {
										korisnikProzor.style.display = "none";
										document.removeEventListener("keydown", escListener);
									}
								}
								document.addEventListener("keydown", escListener);
							});
						});
					})
					.catch(error => console.error("Greška pri dohvaćanju aktivnih korisnika:", error));

				// Klik na X dugme za zatvaranje korisničkog modala
				document.querySelector(".zatvori-korisnik").addEventListener("click", () => {
					korisnikProzor.style.display = "none";
				});

				// Klik izvan modala zatvara modal (pretpostavka da overlay ima id korisnikProzor)
				window.addEventListener("click", (event) => {
					if (event.target === korisnikProzor) {
						korisnikProzor.style.display = "none";
					}
				});
			});
			
			
			window.addEventListener("keydown", function(event) {
				if (
					event.key === "Backspace" &&
					document.activeElement.tagName !== "INPUT" &&
					document.activeElement.tagName !== "TEXTAREA"
				) {
					event.preventDefault();
					window.location.href = "index.html";
				}
			});

