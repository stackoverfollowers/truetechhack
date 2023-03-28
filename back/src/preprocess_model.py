from math import ceil

import cv2
import numpy as np
import skvideo.io
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC


def calculate_gray_timings(video_filename: str) -> list[tuple[int, int]]:
    print(video_filename, "asdfa")
    frames = skvideo.io.vread(video_filename)
    gray_frames = []
    for frame in frames:
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        resized_frame = cv2.resize(gray_frame, (64, 64))
        gray_frames.append(resized_frame)

    X = np.array(gray_frames).reshape(len(gray_frames), -1)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    pca = PCA(n_components=100)
    X_pca = pca.fit_transform(X_scaled)

    y = np.zeros(len(gray_frames))
    seizure_start = 500
    seizure_end = 700
    y[seizure_start:seizure_end] = 1
    X_train, X_test, y_train, y_test = train_test_split(
        X_pca, y, test_size=0.2, random_state=42
    )
    svm = SVC(kernel="linear", random_state=42)
    svm.fit(X_train, y_train)
    y_pred = svm.predict(X_test)

    frame_rate = eval(skvideo.io.ffprobe(video_filename)["video"]["@r_frame_rate"])
    frame_interval = 1.0 / float(frame_rate)

    timings = []
    start, end = None, None
    for i in range(seizure_start, seizure_end):
        if y_pred[i - seizure_start] == 1:
            ts = i * frame_interval
            if start is None:
                start = int(ts)
                end = start
            else:
                if ts - end < 2:
                    end = ceil(ts)
                else:
                    start = None
                    end = ceil(ts)
                    timings.append((start, end))
                    end = None

    if start is not None:
        end = end or start
        timings.append((start, end))
    print(timings)

    return timings
