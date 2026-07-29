const h2 = { margin: "0 0 10px" };
const ul = { margin: "10px 0 0", paddingLeft: 10 };
const soft = { color: "var(--text-soft)" };

export function AboutApp() {
  return (
    <div>
      <h2 style={h2}>hello, I'm reimunyancat.</h2>
      <p style={soft}>Designer, Developer</p>
      <ul style={ul}>
        <li>
          GitHub:{" "}
          <a
            href="https//github.com/reimunyancat"
            target="_blank"
            rel="noreferrer"
          >
            @reimunyancat
          </a>
        </li>
      </ul>
    </div>
  );
}
