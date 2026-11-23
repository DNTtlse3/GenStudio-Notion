"use client";

import { useEffect, useState } from "react";
import styles from "./specific.module.css";
import { type Page_Native_Struct} from "@/lib/utils";
import { BsFileRichtext, BsEyeFill } from "react-icons/bs";


export default function HomePage() {

	const [isNotionConnected, setIsNotionConnected] = useState(false);
	const [workspace, setWorkspace] = useState("");
	const [pages, setPages] = useState<Page_Native_Struct[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [isProcessId, setIsProcessId] = useState("");


	async function load_pages(){

		setIsLoading(true);
		
		try {


			const status_response = await fetch(
				"/api/notion/status",
				{ cache: "no-store" }
			);

			const status = await status_response.json();

			setIsNotionConnected(Boolean(status.connected));
			setWorkspace(status.workspace_name || "");

			if(status.connected){

				const pages_response = await fetch(
					"/api/notion/pages",
					{ cache: "no-store" }
				);


				const result = await pages_response.json();

				if(!pages_response.ok){
					throw new Error(result.error || "Unable to load pages");
				} 

				setPages(result.pages || []);
			}else{
				setPages([]);
			}

		} catch (error){
			setMessage(error instanceof Error ? error.message : "An error occured.");
		} finally{
			setIsLoading(false);
		}
	}

	useEffect(() => { load_pages(); }, []);

	async function connect_to_notion(){
		window.location.href = "/api/auth/notion/connect";
	}

	async function disconnect_from_notion(){
		setMessage("")

		await fetch(
			"/api/auth/notion/disconnect",
			{ method : "POST" }
		);

		setIsNotionConnected(false);
		setWorkspace("")
	}

	async function generate_pdf(page : Page_Native_Struct){

	}


	return (

		<main className={styles.shellBoard}>

			<header className={styles.topbar}>
				<a className={styles.nameApp} href="/">Gen<span>Studio</span></a>
				<div className={styles.headerRight}>
					<span className={`${styles.status} ${isNotionConnected ? styles.online : ""}`}>
						<i />{isNotionConnected ? "Connectd" : "Not connected"}
					</span>
					{isNotionConnected && 
						<button className={styles.textButton} onClick={disconnect_from_notion}>
							Log out
						</button>}
				</div>
			</header>

			{/*Section : Introduction et button pour connecter Notion*/}
			<section className={styles.intro}>
				<p className={styles.sectionTitle}>Documetary Section</p>
				<h1> Your Notion pages,<br/><span>are ready to be exported.</span></h1>
				<p className={styles.subtitle}>
					Find your Notion pages and turn then into clean documents with just a few clicks.
				</p>

				{!isNotionConnected && 
					<button className={styles.primary} onClick={connect_to_notion}>
						Connect Notion
					</button>
				}

				{isNotionConnected && 
					<p className={styles.workspace}>
						Connected Space : <strong>{workspace || "Notion"}</strong>
					</p>
				}
			</section>

			{/*Section : Affichage des pages trouvés */}
			<section className={styles.content}>
				<div className={styles.sectionHeading}>
					<div>
						<p className={styles.sectionTitle}>
							Library
						</p>
						<h2>
							Notion Pages
						</h2>
					</div>

					{isNotionConnected && 
						<button className={styles.refresh} onClick={load_pages}>
							refresh
						</button>
					}
				</div>

				{message && 
					<p className={styles.error}>
						{message}
					</p>
				}

				{isLoading ? <div className={styles.empty}>Loading....</div> :
					!isNotionConnected ?
						<div className={styles.empty}>
							<div className={styles.emptyIcon}>
								N
							</div>
							<h3>Connect your Notion Account</h3>
							<p>
								Pages shared using the integration will appear here.
							</p>
						</div> : 
						pages.length === 0 ?
							<div className={styles.empty}>
								<h3>No page found</h3>
								<p>Please check that you have authorized acess to pages.</p>
							</div> :
							
								<div className={styles.pageList}>
									{
										pages.map((page) =>(

											<article className={styles.pageCard} key={page.id}>
												<div className={styles.pageIcon}><BsFileRichtext size={30}/></div>
												<div className={styles.pageInfo}>
													<h3>{page.title}</h3>
													<p>
														{page.last_edited_time ? 
															`Last updated on ${new Date(page.last_edited_time).toLocaleDateString("fr-FR")}` : "Notion page"
														}
													</p>
												</div>
												<div className={styles.actions}>
													<a className={styles.secondary} href={page.url} target="_blank" rel="noopener noreferrer">
														<BsEyeFill size={20}/>
													</a>

													<button 
														className={styles.primarySmall} 
														onClick={() => generate_pdf(page)}
														disabled={isProcessId === page.id} 
													>
														{isProcessId === page.id ? "Generating..." : "Generate PDF"}
													</button>
												</div>
											</article>
										))
									}
								</div>
				}
			</section>

			<footer className={styles.footer}>
				GenStudio
			</footer>
		</main>

	);

}

