"use client";

import { use, useState, useMemo } from "react";
import Editor from "@monaco-editor/react";
import styles from "./editor.module.css";
import { BsFillHouseFill } from "react-icons/bs";

import { useRouter } from "next/navigation";

export default function EditorPage({params}:{ params: Promise<{id:string}>}){

	const router = useRouter();

	/*
		ID de la page Notion qui va être utilisé pour la génération de la page
		en PDF
	*/
	const { id } = use(params);

	/**/
	//const [content, setContent] = useState("");

	/*
		useState l'éditeur qui est courant
	*/
	const [isHtml, setIsHtml ] = useState<"html" | "css">("html");


	/*
		usSate pour les contenues de l'éditeur CSS et HTML
	*/
	const [html, setHtml] = useState("<html></html>");
	const [css, setCss] = useState(".body{}");


	async function getHome(){
		router.push("/");
	}

	/*
		On met en cache à chaque re-calcul provoquer par les useState
	*/
	const preview = useMemo(() => {
		return `<!DOCTYPE html>
				<html>
					<head>
						<style>
							${css}
						</style>
					</head>
					<body>
						${html}
					</body>
				</html>
		`; 
	},[html, css]);


	return (
		<div className={styles.globalContainer}>

			<div className={styles.topButtons}>

				{/*Button pour changer d'éditeur*/}
				<div className={styles.tabButton}>
					<button
						className={isHtml === "html" ? styles.currentLanguage : styles.notCurrent}
						onClick={() => setIsHtml("html")}
					>
						template.index
					</button>

					<button
						className={isHtml === "css" ? styles.currentLanguage : styles.notCurrent}
						onClick={() => setIsHtml("css")}
					>
						style.css
					</button>
				</div>

				<div className={styles.topButtonsCompHome}>

					<button
						className={styles.compileButton}
						
					>
						Compile
					</button>

					{/*Button de secours pour revenir à la page d'acceuil de connexion.
					 Puisque le button arrière du navigateur à tendance à ne pas bien marcher
					 si on veut faire un retour en arrière.

					 Note : Trouver une solution pour la future mise-à-jour
					*/}
					<button
						className={styles.homeButton}
						onClick={() => getHome()}
					>
						<BsFillHouseFill size={25}/>
					</button>

				</div>


			</div>

			<div className={styles.editPrevContainer}>
			
			<div className={styles.editorConfig}>
				{isHtml === "html" && (
					<div className={styles.editor}>
                    <Editor
                        height="85vh"
                        width="105vh"
                        language="html"
                        theme="hc-black"
                        value={html}
                        onChange={(value) => setHtml(value ?? "")}
                    />
                	</div>
                )}

                {isHtml === "css" && (
                	<div className={styles.editor}>
                    <Editor
                        height="85vh"
                        width="105vh"
                        language="css"
                        theme="hc-black"
                        value={css}
                        onChange={(value) => setCss(value ?? "")}
                    />
                    </div>
                )}

			</div>

			{/*On utilse iframe pour avoir notre rendu de la page Notion*/}
			<div className={styles.preview}>
				<iframe
					title="preview"
					srcDoc={preview}
					sandbox="allow-scripts"
					className={styles.iframeConfig}
				/>
			</div>

			</div>

		</div>
	);
}