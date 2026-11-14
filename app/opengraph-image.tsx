import { ImageResponse } from "next/og";

export const alt =
  "The Nine Files — a noir tic-tac-toe case wall with a red yarn winning line";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BOARD = [
  ["X", "O", "X"],
  ["O", "X", "O"],
  ["X", "O", "X"],
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 52,
          padding: 64,
          backgroundColor: "#0B0C0E",
          color: "#EFE6D2",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(227,164,75,0.18), rgba(227,164,75,0) 68%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            height: 502,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 17,
                letterSpacing: 5,
                color: "#9A958A",
              }}
            >
              DIVISION 9 · CASE FILE № 003
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 92,
                fontWeight: 700,
                letterSpacing: 1,
                lineHeight: 0.92,
                marginTop: 20,
              }}
            >
              THE NINE
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 92,
                fontWeight: 700,
                letterSpacing: 1,
                lineHeight: 0.92,
              }}
            >
              FILES
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 27,
                color: "#9A958A",
                marginTop: 24,
                fontStyle: "italic",
              }}
            >
              A tic-tac-toe case in nine clues.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                letterSpacing: 4,
                color: "#E3A44B",
              }}
            >
              TWO DETECTIVES · NINE CLUES · THREE IN A ROW
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 15,
                letterSpacing: 3,
                color: "#9A958A",
              }}
            >
              NINE-FILES.VERCEL.APP
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: 13,
            backgroundColor: "#6F4A2D",
            borderRadius: 5,
            position: "relative",
            boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
          }}
        >
          {BOARD.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: "flex", gap: 10 }}>
              {row.map((mark, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 108,
                    height: 108,
                    backgroundColor: "#D8C39A",
                    borderRadius: 2,
                    color: "#14100D",
                    fontSize: mark === "X" ? 64 : 58,
                    fontWeight: 700,
                    boxShadow: "0 8px 14px rgba(0,0,0,0.45)",
                  }}
                >
                  {mark}
                </div>
              ))}
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              left: -22,
              top: 178,
              width: 390,
              height: 8,
              backgroundColor: "#A8323B",
              borderRadius: 9999,
              transform: "rotate(45deg)",
              boxShadow: "0 3px 5px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
