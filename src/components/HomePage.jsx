import { useEffect, useRef, useState } from "react";

const HomePage = (props) => {
	// eslint-disable-next-line react/prop-types, no-unused-vars
	const { setFile, setAudioStream } = props;
	const handleInput = (e) => {
		const tempFile = e.target.files[0];
		setFile(tempFile);
		console.log(tempFile);
	};
	const [recordingStatus, setRecordingStatus] = useState(false);
	const [audioChunks, setAudioChunks] = useState([]);
	const [duration, setDuration] = useState(0);

	const mediaRecorder = useRef(null);
	const mimeType = "audio/webm";

	async function StartRecording() {
		let tempStream;
		console.log("Start recording");
		try {
			const streamData = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			});
			tempStream = streamData;
		} catch (error) {
			console.log(error.message);
		}
		setRecordingStatus(true);
		const media = new MediaRecorder(tempStream, { mimeType: mimeType });
		mediaRecorder.current = media;

		mediaRecorder.current.start();
		let localAudioChunks = [];
		mediaRecorder.current.ondataavailable = (event) => {
			if (typeof event.data === "undefined") {
				return;
			}
			if (event.data.size === 0) {
				return;
			}
			localAudioChunks.push(event.data);
		};
		setAudioChunks(localAudioChunks);
	}

	async function StopRecording() {
		setRecordingStatus(false);
		console.log("Stopped recording");
		mediaRecorder.current.stop();
		mediaRecorder.current.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: mimeType });
			setAudioStream(audioBlob);
			setAudioChunks([]);
			setDuration(0);
		};
	}
	useEffect(() => {
		let interval;
		if (recordingStatus) {
			interval = setInterval(() => {
				setDuration((curr) => curr + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	});
	return (
		<main className="flex-1 p-4 flex flex-col gap:3 sm:gap-4 md:gap-5 justify-center text-center pb-20">
			<h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
				FreeScribe
			</h1>
			<h3 className="font-medium md:text-lg">
				Record <span className="text-white text-xl">&rarr;</span> Transcribe{" "}
				<span className="text-white text-xl">&rarr;</span> Translate
			</h3>
			<button
				onClick={recordingStatus ? StopRecording : StartRecording}
				className="flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-xl text-gray-600"
			>
				<p className="text-blue-600">
					{recordingStatus ? `Stop recording` : "Record"}
				</p>
				<div className="flex items-center gap-2">
					{duration !== 0 && <p className="text-sm">{duration} sec</p>}
				</div>
				<i
					className={
						"fa-solid fa-microphone duration-200" +
						(recordingStatus ? "text-rose-400" : "")
					}
				></i>
			</button>
			<p className="text-xl">
				Or{" "}
				<label className="text-blue font-bold cursor pointer text-blue-400 hover:text-red-300 duration-200">
					upload{" "}
					<input
						className="hidden"
						type="file"
						accept=".mp3,.wave"
						onChange={handleInput}
					/>
				</label>
				a mp3 file
			</p>
			<p className="italic ">Free now free forever!</p>
		</main>
	);
};

export default HomePage;
