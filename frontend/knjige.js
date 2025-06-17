
			const API_URL = "http://localhost:8080/api/knjige";

			function ucitajKnjige() {
				fetch(API_URL)
					.then(res => res.json())
					.then(data => {
						const tbody = document.querySelector("#listaKnjiga tbody");
						tbody.innerHTML = "";

						data.forEach(knjiga => {
							const row = document.createElement("tr");
							
							let status = knjiga.status || "N/A";
							
							const dugmeAkcija = status.startsWith("Zadužena")
								? `<button class="btn-razduzi" onclick="razduziKnjigu(${knjiga.id})">Razduži</button>`
								: `<button class="btn-zaduzi" onclick="zaduziKnjigu(${knjiga.id})">Zaduži</button>`;


						row.innerHTML = `
							<td class="id-klasa" style="cursor: pointer;">${knjiga.id}</td>
							<td class="naslov-klasa" style="cursor: pointer;">${knjiga.naslov}</td>
							<td class="autor">${knjiga.autor}</td>
							<td class="status">${status}</td>								
							<td class="zanr">${knjiga.zanr}</td>
							<td class="jezik">${knjiga.jezik}</td>
							<td class="akcije">
								<button class="btn-obrisi" onclick="obrisiKnjigu(${knjiga.id})">Obriši</button>
								<button class="btn-izmijeni" onclick="toggleIzmjena(this, ${knjiga.id})">Izmijeni</button>
								${dugmeAkcija}
							</td>
						`;
						
						row.querySelector(".id-klasa").addEventListener("click", () => prikaziDetaljeKnjige(knjiga));
						row.querySelector(".naslov-klasa").addEventListener("click", () => prikaziDetaljeKnjige(knjiga));
						
						row.querySelector(".autor").addEventListener("click", () => prikaziAutora(knjiga.autor));



							tbody.appendChild(row);
							


						});
					});
			}
			
			
			function prikaziAutora(imeAutora) {
				const prozor = document.getElementById("autorProzor");
				const detalji = document.getElementById("autorDetalji");
				const zatvori = prozor.querySelector(".custom-close");

				detalji.textContent = `Autor: ${imeAutora}`;
				prozor.style.display = "flex";

				zatvori.onclick = () => prozor.style.display = "none";

				window.addEventListener("click", function (event) {
					if (event.target === prozor) {
						prozor.style.display = "none";
					}
				});

				document.addEventListener("keydown", function (event) {
					if (event.key === "Escape") {
						prozor.style.display = "none";
					}
				});
			}

			

			
			function filterBooks() {
				const input = document.getElementById("searchInput").value.toLowerCase();
				const table = document.getElementById("listaKnjiga");
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
			
			

			
			document.getElementById("filterSelect").addEventListener("change", function () {
				const selectedStatus = this.value;
				
				if (selectedStatus === "all") {
					document.querySelectorAll("#listaKnjiga tbody tr").forEach(row => row.style.display = "");
				} else {
					filterByStatus(selectedStatus);
				}
			});
			
			
			function filterByStatus(status) {
				const rows = document.querySelectorAll("#listaKnjiga tbody tr");
				rows.forEach(row => {
					const statusCell = row.cells[3]; 
					if (statusCell.textContent.trim().startsWith(status)) { 
						row.style.display = ""; 
					} else {
						row.style.display = "none"; 
					}
				});
			}






			
			
			const modal = document.getElementById("modal");
			const btnPrikaziFormu = document.getElementById("btnPrikaziFormu");
			const zatvoriModal = document.getElementById("zatvoriModal");

			// Otvori modal
			btnPrikaziFormu.addEventListener("click", () => {
				modal.style.display = "flex";
				document.getElementById("naslov").focus();
			});

			// Zatvori modal (X dugme)
			zatvoriModal.addEventListener("click", () => {
				zatvoriFormu();
			});


			document.getElementById("btnOtkaziDodavanje").addEventListener("click", () => {
				zatvoriFormu();
			});


			// Klik van modalnog prozora zatvara modal
			window.addEventListener("click", function (event) {
				if (event.target === modal) {
					zatvoriFormu();
				}
			});

			// Escape zatvara modal
			document.addEventListener("keydown", function (event) {
				if (event.key === "Escape" && modal.style.display === "flex") {
					zatvoriFormu();
				}
			});

			// Reset i zatvaranje forme
			function zatvoriFormu() {
				modal.style.display = "none";
				document.getElementById("naslov").value = "";
				document.getElementById("autor").value = "";
				document.getElementById("zanr").value = "";
				document.getElementById("jezik").value = "";
			}


			function dodajKnjigu() {
				const naslov = document.getElementById("naslov").value.trim();
				const autor = document.getElementById("autor").value.trim();
				const zanr = document.getElementById("zanr").value.trim();
				const jezik = document.getElementById("jezik").value.trim();

				if (!naslov || !autor) {
					alert("Naziv knjige i ime autora su obavezni.");
					return;
				}

				const knjiga = { naslov, autor, zanr, jezik };
				


				fetch(API_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...knjiga, dostupna: true })
				})
				.then(() => {
					ucitajKnjige();
					document.getElementById("naslov").value = "";
					document.getElementById("autor").value = "";
					document.getElementById("zanr").value = "";
					document.getElementById("jezik").value = "";
					document.getElementById("btnPrikaziFormu").textContent = "DODAJ KNJIGU";
				});
				
				zatvoriFormu();
			}

			// Enter za unos
			["naslov", "autor", "zanr", "jezik"].forEach(id => {
				document.getElementById(id).addEventListener("keydown", function (event) {
					if (event.key === "Enter") {
						event.preventDefault();
						dodajKnjigu();
					}
				});
			});

			// Escape za otkazivanje dodavanja
			document.addEventListener("keydown", function (event) {
				if (event.key === "Escape") {
					const aktivniElement = document.activeElement;
					const polja = ["naslov", "autor", "zanr", "jezik"];
					if (polja.includes(aktivniElement.id)) {
						document.getElementById("naslov").value = "";
						document.getElementById("autor").value = "";
						document.getElementById("zanr").value = "";
						document.getElementById("jezik").value = "";
						document.activeElement.blur();
					}
				}
			});

			function obrisiKnjigu(id) {
				const potvrda = window.confirm("Da li ste sigurni da želite obrisati knjigu?");
				if (potvrda) {
					fetch(`${API_URL}/${id}`, { method: "DELETE" })
						.then(() => ucitajKnjige());
				}
			}
				
			
			
	

			function toggleIzmjena(btn, id) {
				const tr = btn.closest("tr");
				const jeURezimIzmjene = btn.textContent === "Sačuvaj";

				if (!jeURezimIzmjene) {
					const naslov = tr.querySelector(".naslov").textContent;
					const autor = tr.querySelector(".autor").textContent;
					const zanr = tr.querySelector(".zanr").textContent;
					const jezik = tr.querySelector(".jezik").textContent;

					tr.querySelector(".naslov").innerHTML = `<input type="text" value="${naslov}" data-original="${naslov}">`;
					tr.querySelector(".autor").innerHTML = `<input type="text" value="${autor}" data-original="${autor}">`;
					tr.querySelector(".zanr").innerHTML = `<input type="text" value="${zanr}" data-original="${zanr}">`;
					tr.querySelector(".jezik").innerHTML = `<input type="text" value="${jezik}" data-original="${jezik}">`;

					btn.textContent = "Sačuvaj";
					tr.querySelector(".naslov input").focus();

					tr.querySelectorAll("input").forEach(input => {
						input.addEventListener("keydown", function (event) {
							if (event.key === "Enter") {
								event.preventDefault();
								toggleIzmjena(btn, id);
							} else if (event.key === "Escape") {
								event.preventDefault();

								tr.querySelector(".naslov").textContent = naslov;
								tr.querySelector(".autor").textContent = autor;
								tr.querySelector(".zanr").textContent = zanr;
								tr.querySelector(".jezik").textContent = jezik;

								btn.textContent = "Izmijeni";
							}
						});
					});
				} else {
					const novaKnjiga = {
						naslov: tr.querySelector(".naslov input").value.trim(),
						autor: tr.querySelector(".autor input").value.trim(),
						zanr: tr.querySelector(".zanr input").value.trim(),
						jezik: tr.querySelector(".jezik input").value.trim(),
						dostupna: true
					};

					fetch(`${API_URL}/${id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(novaKnjiga)
					})
					.then(response => {
						if (!response.ok) throw new Error("Greška pri izmjeni knjige");
						return response.json();
					})
					.then(data => {
						tr.querySelector(".naslov").textContent = data.naslov;
						tr.querySelector(".autor").textContent = data.autor;
						tr.querySelector(".zanr").textContent = data.zanr;
						tr.querySelector(".jezik").textContent = data.jezik;

						btn.textContent = "Izmijeni";
						alert("Knjiga je uspješno izmijenjena.");
					})
					.catch(err => {
						console.error(err);
						alert("Naziv knjige i ime autora su obavezni.");
					});
				}
			}

			
			



			function zaduziKnjigu(knjigaId) {
				
					ucitajKorisnike();
				
				
					const modal = document.getElementById("usernameModal");
					const closeBtn = document.querySelector(".close");
					const confirmBtn = document.getElementById("confirmBtn");
					const cancelBtn = document.getElementById("closeBtn"); // Dugme Otkaži
					const input = document.getElementById("usernameInput");
					const datumInput = document.getElementById("datumInput"); // NOVO


					modal.style.display = "block";
					input.focus();
				  
					const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
					datumInput.value = today;

					closeBtn.onclick = () => modal.style.display = "none";
					cancelBtn.onclick = () => modal.style.display = "none";
				  
				  
					window.onclick = (event) => {
					if (event.target === modal) modal.style.display = "none";
						};
				  
				  
				document.addEventListener("keydown", (event) => {
					if (modal.style.display === "block") {
						if (event.key === "Enter") {
							confirmBtn.click(); // Simuliramo klik na dugme Zaduži
						} else if (event.key === "Escape") {
							modal.style.display = "none"; // Zatvaramo modal
						}
					}
				});
				

				  confirmBtn.onclick = () => {
						const username = input.value.trim();
						const datumZaduzenja = datumInput.value;
						
						if (!username) {
						  alert("Unesite korisničko ime.");
						  return;
						}
						
					    if (!datumZaduzenja) {
						  alert("Unesite datum zaduženja.");
						  return;
						}

						modal.style.display = "none";

						fetch(`http://localhost:8080/api/zaduzenja/zaduzi?knjigaId=${knjigaId}&username=${username}`, {
						  method: "POST"
						})
						.then(response => {
						  if (!response.ok) {
							return response.text().then(msg => { throw new Error(msg); });
						  }
						  return response.text();
						})
						.then(msg => {
						  alert(msg);
						  ucitajKnjige();
						})
						.catch(err => {
						  alert("Greška: " + err.message);
						});

						input.value = "";
						datumInput.value
				  };
			}
			
			//ne znam šta radi ova metoda
			function ucitajKorisnike() {
					  fetch("http://localhost:8080/api/korisnici")
						.then(response => response.json())
						.then(korisnici => {
						  const datalist = document.getElementById("korisniciList");
						  datalist.innerHTML = ""; // očisti stari sadržaj

						  korisnici.forEach(k => {
							const option = document.createElement("option");
							option.value = k.username;
							datalist.appendChild(option);
						  });

						  // Sačuvaj sve usernameove za provjeru u JS-u
						  window.validUsernames = korisnici.map(k => k.username);
						});
					}

		

			function razduziKnjigu(knjigaId) {
				fetch(`http://localhost:8080/api/zaduzenja/razduzi?knjigaId=${knjigaId}`, {
					method: "POST"
				})
				.then(() => ucitajKnjige())
				.catch(err => console.error("Greška pri razduživanju:", err));
			}
	


			
			function prikaziDetaljeKnjige(knjiga) {
				const modal = document.getElementById("detaljiModal");

				document.getElementById("detaljiId").textContent = knjiga.id;
				document.getElementById("detaljiNaslov").textContent = knjiga.naslov;
				document.getElementById("detaljiAutor").textContent = knjiga.autor;
				document.getElementById("detaljiStatus").textContent = knjiga.status || "N/A";
				document.getElementById("detaljiZanr").textContent = knjiga.zanr;
				document.getElementById("detaljiJezik").textContent = knjiga.jezik;
				
				document.getElementById("detaljiKorisnik").textContent = knjiga.korisnik || "—";
				document.getElementById("detaljiDatum").textContent = knjiga.datumZaduzenja || "—";

				modal.style.display = "flex"; // ili "block", zavisi od CSS-a

				// Escape za zatvaranje
				function escListener(e) {
					if (e.key === "Escape") {
						modal.style.display = "none";
						document.removeEventListener("keydown", escListener);
					}
				}
				document.addEventListener("keydown", escListener);
			}

			

			document.querySelector(".closeDetalji").addEventListener("click", () => {
				document.getElementById("detaljiModal").style.display = "none";
			});

			window.addEventListener("click", (event) => {
				const modal = document.getElementById("detaljiModal");
				if (event.target === modal) {
					modal.style.display = "none";
				}
				
				
			});
			

			function otvoriTab(evt, tabId) {
			  const tabovi = document.querySelectorAll(".tab-sadrzaj");
			  const dugmad = document.querySelectorAll(".tabovi .tab");

			  tabovi.forEach(tab => tab.classList.remove("active"));
			  dugmad.forEach(tab => tab.classList.remove("active"));

			  document.getElementById(tabId).classList.add("active");
			  evt.currentTarget.classList.add("active");
			}
			
			
			document.querySelector(".closeDetalji").addEventListener("click", () => {
				document.getElementById("detaljiModal").style.display = "none";
			});
			
			window.addEventListener("click", function (event) {
				const modal = document.getElementById("detaljiModal");
				if (event.target === modal) {
					modal.style.display = "none";
				}
			});




			

			ucitajKnjige();