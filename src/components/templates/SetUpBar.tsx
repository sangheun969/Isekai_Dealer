import React, { useState, useEffect } from "react";
import Phaser from "phaser";

interface SetUpBarProps {
  onClose: () => void;
  scene: Phaser.Scene;
}

const SetUpBar: React.FC<SetUpBarProps> = ({ onClose, scene }) => {
  const [selectedTab, setSelectedTab] = useState<string>("audio");
  const [bgmVolume, setBgmVolume] = useState<number>(0.5);
  const [effectVolume, setEffectVolume] = useState<number>(0.5);
  const [resolution, setResolution] = useState<string>("1920x1080");

  useEffect(() => {
    scene.input.enabled = false;
    return () => {
      scene.input.enabled = true;
    };
  }, [scene]);

  useEffect(() => {
    const bgm = scene.registry.get("bgm") as
      | Phaser.Sound.WebAudioSound
      | undefined;
    if (bgm && typeof bgm.volume === "number") {
      setBgmVolume(bgm.volume);
    }

    const storedEffectVolume = scene.registry.get("effectVolume") as
      | number
      | undefined;
    if (storedEffectVolume !== undefined) {
      setEffectVolume(storedEffectVolume);
    }
  }, [scene]);

  const handleBgmVolumeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVolume = parseFloat(event.target.value);
    setBgmVolume(newVolume);

    const bgm = scene.registry.get("bgm") as
      | Phaser.Sound.WebAudioSound
      | undefined;
    if (bgm && typeof bgm.setVolume === "function") {
      bgm.setVolume(newVolume);
    }
  };

  const handleEffectVolumeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVolume = parseFloat(event.target.value);
    setEffectVolume(newVolume);

    scene.registry.set("effectVolume", newVolume);

    let effectSound = scene.sound.get("buttonClick") as
      | Phaser.Sound.BaseSound
      | undefined;

    if (!effectSound) {
      effectSound = scene.sound.add("buttonClick", {
        volume: newVolume,
      }) as Phaser.Sound.WebAudioSound;
    }
    if (effectSound instanceof Phaser.Sound.WebAudioSound) {
      effectSound.setVolume(newVolume);
      effectSound.play();
    }
  };

  const handleResolutionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newResolution = event.target.value;
    setResolution(newResolution);

    const [newWidth, newHeight] = newResolution.split("x").map(Number);
    scene.scale.resize(newWidth, newHeight);

    const gameContainer = document.getElementById("phaser-game-container");
    if (gameContainer) {
      gameContainer.style.width = `${newWidth}px`;
      gameContainer.style.height = `${newHeight}px`;
    }
  };

  return (
    <div className="w-full h-[100vh] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-full h-full bg-black p-6 rounded-lg shadow-lg">
        <div className="py-9 flex flex-row justify-around items-center border-2 border-b-indigo-500">
          <button
            className={`text-white px-6 py-2 rounded-md mb-4 border ${
              selectedTab === "video" ? "bg-indigo-500" : ""
            }`}
            onClick={() => setSelectedTab("video")}
          >
            비디오
          </button>
          <button
            className={`text-white px-6 py-2 rounded-md mb-4 border ${
              selectedTab === "audio" ? "bg-indigo-500" : ""
            }`}
            onClick={() => setSelectedTab("audio")}
          >
            오디오
          </button>
          <button
            className={`text-white px-6 py-2 rounded-md mb-4 border ${
              selectedTab === "language" ? "bg-indigo-500" : ""
            }`}
            onClick={() => setSelectedTab("language")}
          >
            언어
          </button>
        </div>
        <div className="text-white flex flex-col justify-center items-center border h-[70%]">
          {selectedTab === "video" && (
            <div className="flex flex-col items-center gap-4">
              <p>📺 화면 해상도 설정</p>
              <select
                value={resolution}
                onChange={handleResolutionChange}
                className="text-black px-4 py-2 rounded-md"
              >
                <option value="1280x720">1280 x 720 (HD) 🔽</option>
                <option value="1920x1080">1920 x 1080 (FHD) ✅</option>
                <option value="2560x1440">2560 x 1440 (QHD)</option>
              </select>
            </div>
          )}

          {selectedTab === "audio" && (
            <div className="flex flex-col items-center gap-4">
              <p>🎵 오디오 설정</p>
              <label className="flex flex-col items-center">
                배경음 볼륨: {Math.round(bgmVolume * 100)}%
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={bgmVolume}
                  onChange={handleBgmVolumeChange}
                  className="w-60 mt-2"
                />
              </label>
              <label className="flex flex-col items-center mt-4">
                효과음 볼륨: {Math.round(effectVolume * 100)}%
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={effectVolume}
                  onChange={handleEffectVolumeChange}
                  className="w-60 mt-2"
                />
              </label>
            </div>
          )}

          {selectedTab === "language" && (
            <div className="flex flex-col items-center gap-4">
              <p>🌍 언어 설정</p>
            </div>
          )}
        </div>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-md w-[150px] mb-4 absolute bottom-5 right-5"
          onClick={() => {
            scene.input.enabled = true;
            onClose();
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SetUpBar;
