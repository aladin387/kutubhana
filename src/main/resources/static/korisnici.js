
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
								<td class="email">${korisnik.email}</td>
								<td class="phone">${korisnik.phone}</td>
								<td class="address">${korisnik.address}</td>
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
				const password = document.getElementById("password").value.trim();
				const email = document.getElementById("email").value.trim();
				const phone = document.getElementById("phone").value.trim();
				const address = document.getElementById("address").value.trim();

				if (!username) {
					alert("Ime korisnika je obavezno");
					document.getElementById("username").focus(); // korisnik vidi gdje treba da upiše
					return;
				}
				if (!password) {
					alert("Lozinka je obavezna");
					document.getElementById("password").focus();
					return;
				}


				const korisnik = { username, password, email, phone, address };


				fetch(API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(korisnik)
				})
				.then(() => {
					ucitajKorisnike();
					document.getElementById("username").value = "";
					document.getElementById("password").value = "";
					document.getElementById("email").value = "";
					document.getElementById("phone").value = "";
					document.getElementById("address").value = "";
					document.getElementById("btnPrikaziFormu").textContent = "DODAJ KORISNIKA";
				});
				
				zatvoriFormu();
			}
			
			//da se dodaje sa enterom
			["username", "email", "phone", "address"].forEach(id => {
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
					
							if (editKorisnikModUkljucen) {
								alert("Već uređujete jednog korisnika. Sačuvajte ili otkažite izmjene prije nastavka.");
								return;
							}

					editKorisnikModUkljucen = true;
					
					const username = tr.querySelector(".username").textContent;
					const password = tr.querySelector(".password").textContent;
					const email = tr.querySelector(".email").textContent;
					const phone = tr.querySelector(".phone").textContent;
					const address = tr.querySelector(".address").textContent;
					
					tr.querySelector(".username").innerHTML = `<input type="text" value="${username}" data-original="${username}">`;
					tr.querySelector(".password").innerHTML = `<input type="text" value="${password}" data-original="${password}">`;
					tr.querySelector(".email").innerHTML = `<input type="text" value="${email}" data-original="${email}">`;
					tr.querySelector(".phone").innerHTML = `<input type="text" value="${phone}" data-original="${phone}">`;
					tr.querySelector(".address").innerHTML = `<input type="text" value="${address}" data-original="${address}">`;

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
								tr.querySelector(".password").textContent = password;
								tr.querySelector(".email").textContent = email;
								tr.querySelector(".phone").textContent = phone;
								tr.querySelector(".address").textContent = address;
								
								btn.textContent = "Izmijeni";
								editKorisnikModUkljucen = false;

							}
						});
					});
				} else {
					const noviKorisnik = {
						username: tr.querySelector(".username input").value.trim(),
						password: tr.querySelector(".password input").value.trim(),
						email: tr.querySelector(".email input").value.trim(),
						phone: tr.querySelector(".phone input").value.trim(),
						address: tr.querySelector(".address input").value.trim()
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
						tr.querySelector(".password").textContent = data.password;
						tr.querySelector(".email").textContent = data.email;
						tr.querySelector(".phone").textContent = data.phone;
						tr.querySelector(".address").textContent = data.address;

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
														
														

													
												//ova funkcija se zove kasnije....		
											function formatDatum(isoDatum) {
												if (!isoDatum) return "-";
												const d = new Date(isoDatum);
												return d.toLocaleDateString("sr-Latn", { year: 'numeric', month: 'short', day: 'numeric' });
											} 
														
											

											// Event listener za otvaranje korisničkog modala
											usernameCell.addEventListener("click", async () => {

														if (editKorisnikModUkljucen) return;

														const info = document.getElementById("korisnikInfo");
														const naslov = document.getElementById("korisnikNaslov");

														naslov.innerHTML = `Zaduživanja knjiga:<br>${usernameCell.textContent}`;
														info.innerHTML = ""; // Očistimo sadržaj

														if (isZaduzen) {
															const p = document.createElement("p");
															p.textContent = "📚 Trenutno ima zaduženu knjigu!";
															info.appendChild(p);

															try {
																const res = await fetch(`http://localhost:8080/api/zaduzenja/korisnik/${userId}`);
																const knjige = await res.json();

																if (knjige.length > 0) {
																	const lista = document.createElement("ul");
																	lista.style.marginTop = "10px";
																	knjige.forEach(knjiga => {
																		const item = document.createElement("li");
																		item.textContent = `${knjiga.naslov} (zaduženo: ${knjiga.datumZaduzenja})`;
																		lista.appendChild(item);
																	});
																	info.appendChild(lista);
																} else {
																	const p = document.createElement("p");
																	p.textContent = "⚠ Nema dostupnih podataka o zaduženim knjigama.";
																	info.appendChild(p);
																}
															} catch (err) {
																console.error("Greška pri dohvaćanju zaduženih knjiga:", err);
																const errorMsg = document.createElement("p");
																errorMsg.textContent = "⚠ Greška pri učitavanju zaduženih knjiga.";
																info.appendChild(errorMsg);
															}
														} else {
															info.textContent = "✔ Nema aktivnih zaduženja.";
														}
														
														// HISTORIJA ZADUŽENJA
													try {
														const resHistorija = await fetch(`http://localhost:8080/api/zaduzenja/korisnik/${userId}/historija`);
														const historija = await resHistorija.json();

														const naslovHistorije = document.createElement("h4");
														naslovHistorije.textContent = "📖 Historija zaduženja:";
														naslovHistorije.style.marginTop = "20px";
														naslovHistorije.style.color = "#333";
														info.appendChild(naslovHistorije);

														if (historija.length > 0) {
															const container = document.createElement("div");
															container.style.marginTop = "10px";

															historija
																.filter(z => z.datumRazduzenja)
																.forEach(z => {
																	const kartica = document.createElement("div");
																	kartica.style.border = "1px solid #ddd";
																	kartica.style.borderRadius = "6px";
																	kartica.style.padding = "10px";
																	kartica.style.marginBottom = "8px";
																	kartica.style.backgroundColor = "#f9f9f9";
																	kartica.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
																	kartica.innerHTML = `
																		<p><strong>📘 Naslov:</strong> ${z.naslov}</p>
																		<p><strong>📅 Zaduženo:</strong> ${formatDatum(z.datumZaduzenja)}</p>
																		<p><strong>📤 Razduženo:</strong> ${
																			z.datumRazduzenja 
																				? formatDatum(z.datumRazduzenja) 
																				: '<span style="color:red;">📚 Još uvijek zaduženo</span>'
																		}</p>
																	`;

																	container.appendChild(kartica);
																});

															info.appendChild(container);

														} else {
															const p = document.createElement("p");
															p.textContent = "Nema historije zaduženja.";
															info.appendChild(p);
															}	
													
													} catch (err) {
														console.error("Greška pri dohvaćanju historije:", err);
														const p = document.createElement("p");
														p.textContent = "⚠ Greška pri učitavanju historije zaduženja.";
														info.appendChild(p);
														}


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
								}).catch(error => console.error("Greška pri dohvaćanju aktivnih korisnika:", error));

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


let currentSortColumn = -1;
let currentSortDirection = 1; // 1 = rastuće, -1 = opadajuće

document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("listaKorisnika");
  const headers = table.querySelectorAll("th");

  headers.forEach((header, index) => {
    header.style.cursor = "pointer";
    header.addEventListener("click", () => sortTableByColumn(index));
  });
});

function sortTableByColumn(columnIndex) {
  const table = document.getElementById("listaKorisnika");
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.querySelectorAll("tr"));

  // Promena smera ako kliknemo na istu kolonu
  if (columnIndex === currentSortColumn) {
    currentSortDirection *= -1;
  } else {
    currentSortDirection = 1;
    currentSortColumn = columnIndex;
  }

  rows.sort((a, b) => {
    let cellA = a.cells[columnIndex].textContent.trim().toLowerCase();
    let cellB = b.cells[columnIndex].textContent.trim().toLowerCase();

    // Ako je broj, upoređuj kao broj
    const isNumeric = !isNaN(cellA) && !isNaN(cellB);
    if (isNumeric) {
      return currentSortDirection * (parseFloat(cellA) - parseFloat(cellB));
    }

    return currentSortDirection * cellA.localeCompare(cellB);
  });

  // Očisti i ponovo dodaj sortirane redove
  tbody.innerHTML = "";
  rows.forEach(row => tbody.appendChild(row));
}
