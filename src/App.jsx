import { useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import TransCribing from "./components/TransCribing";
import { MessageTypes } from "./utils/presets";

function App() {
	const [file, setFile] = useState(null);
	const [audioStream, setAudioStream] = useState(null);
	const [output, setOutput] = useState(null);
	const [loading, setLoading] = useState(false);
	const [finished, setFinished] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const isAudioAvailable = file || audioStream;

	function ResetAudio() {
		setFile(null);
		setAudioStream(null);
	}

	const worker = useRef(null);

	useEffect(() => {
		if (!worker.current) {
			worker.current = new Worker(
				new URL("./utils/whisper.worker.js", import.meta.url),
				{ type: "module" },
			);
		}
		const onMessageReceived = async (e) => {
			switch (e.data.type) {
				case "DOWNLOADING":
					setDownloading(true);
					console.log("donwloading");
					break;
				case "LOADING":
					setLoading(true);
					console.log("loading");
					break;
				case "RESULT":
					console.log("result");
					setOutput(e.data.results);
					console.log(e.data.results);
					break;
				case "INFERENCE_DONE":
					setFinished(true);
					console.log("DONE");
					break;
			}
		};
		worker.current.addEventListener("message", onMessageReceived);

		return () =>
			worker.current.removeEventListener("message", onMessageReceived);
	});

	async function readAudioFrom(file) {
		const sampling_rate = 16000;
		const audioCTX = new AudioContext({ sampleRate: sampling_rate });
		const response = await file.arrayBuffer();
		const decoded = await audioCTX.decodeAudioData(response);
		const audio = decoded.getChannelData(0);
		return audio;
	}

	async function handleFormSubmission() {
		if (!file && !audioStream) {
			return;
		}
		let audio = await readAudioFrom(file ? file : audioStream);
		const model_name = "openai/whisper-tiny.en";
		console.log(audio);
		worker.current.postMessage({
			type: MessageTypes.INFERENCE_REQUEST,
			audio,
			model_name,
		});
	}

	return (
		<div className="flex flex-col max-w-[1000px] mx-auto w-full">
			<section className="min-h-screen flex flex-col">
				<Header />
				{output ? (
					<Information output={output} />
				) : loading ? (
					<TransCribing />
				) : isAudioAvailable ? (
					<FileDisplay
						handleFormSubmission={handleFormSubmission}
						ResetAudio={ResetAudio}
						file={file}
						audioStream={audioStream}
					/>
				) : (
					<HomePage setFile={setFile} setAudioStream={setAudioStream} />
				)}
			</section>
			<footer></footer>
		</div>
	);
}

export default App;
