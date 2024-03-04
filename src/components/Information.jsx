import { useState, useEffect, useRef } from "react";
import Transcription from "./Transcription.jsx";
import Translation from "./Translation.jsx";
const Information = (props) => {
	const { output } = props;
	const [tab, setTab] = useState("transcription");
	const [translation, setTranslation] = useState(null);
	const [translating, setTranslating] = useState(null);
	const [toLanguage, setToLanguage] = useState("Select Language");

	const worker = useRef();
	const unwrapText = (textArr) => {
		const text = [];
		textArr.map((val) => {
			text.push(val.text);
		});
		return text;
	};

	useEffect(() => {
		if (!worker.current) {
			worker.current = new Worker(
				new URL("../utils/translate.worker.js", import.meta.url),
				{ type: "module" },
			);
		}
		const onMessageReceived = async (e) => {
			switch (e.data.status) {
				case "initiate":
					console.log("initiate");
					break;
				case "progress":
					console.log("progress");
					break;
				case "update":
					console.log("result");
					console.log(e.data.output);
					setTranslation(e.data.output);

					break;
				case "complete":
					setTranslating(false);
					console.log("DONE");
					break;
			}
		};
		worker.current.addEventListener("message", onMessageReceived);

		return () =>
			worker.current.removeEventListener("message", onMessageReceived);
	}, []);
	const textElement =
		tab === "transcription" ? unwrapText(output) : translation || "";
	function handleCopy() {
		navigator.clipboard.writeText(textElement);
	}
	function handleDownload() {
		const element = document.createElement("a");
		const file = new Blob([textElement], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `FreeScribe_${new Date().toString()}.txt`;
		document.body.appendChild(element);
		element.click();
	}

	function generateTranslation() {
		if (translating || toLanguage === "Select Language") {
			return;
		}
		const clearText = unwrapText(output);
		setTranslating(true);
		console.log(toLanguage);
		worker.current.postMessage({
			text: clearText,
			src_lang: "eng_Latn",
			tgt_lang: toLanguage,
		});
	}

	return (
		<main className="flex-1 p-4 flex flex-col gap:3 sm:gap-4 md:gap-5 justify-center text-center pb-20 max-w-prose w-full mx-auto">
			<h1 className="font-semibold text-2xl sm:text-3xl md:text-3xl">
				Your transcription:{" "}
			</h1>
			<div className="grid grid-cols-2 mx-auto  rounded-full shadow overflow-hidden items-center mb-5">
				<button
					onClick={() => setTab("transcription")}
					className={
						"px-4 duration-200 py-1 font-medium " +
						(tab === "transcription"
							? "bg-green-700 text-white"
							: " hover:text-blue-200")
					}
				>
					Transcription
				</button>
				<button
					onClick={() => setTab("translation")}
					className={
						"px-4 duration-200 py-1 font-medium " +
						(tab === "translation"
							? "bg-green-700 text-white"
							: " hover:text-blue-200")
					}
				>
					Translation
				</button>
			</div>

			{tab === "transcription" ? (
				<Transcription TextElement={textElement} />
			) : (
				<Translation
					textElement={textElement}
					toLanguage={toLanguage}
					translating={translating}
					setTranslating={setTranslating}
					setTranslation={setTranslation}
					setToLanguage={setToLanguage}
					generateTranslation={generateTranslation}
				/>
			)}

			<div className="flex items-center gap-4 mx-auto text-lg">
				<button
					onClick={handleCopy}
					title="Copy"
					className="iconBtn p-2 rounded px-4"
				>
					<i className="fa-regular fa-copy"></i>
				</button>
				<button
					onClick={handleDownload}
					title="Download"
					className="iconBtn p-2 rounded px-4"
				>
					<i className="fa-regular fa-circle-down"></i>
				</button>
			</div>
		</main>
	);
};

export default Information;
