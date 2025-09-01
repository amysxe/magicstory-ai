export default function Story({ data }) {
  if (!data) return null;

  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <h2 id="story-title">{data.title}</h2>
      {data.content.split("\n").map((p, i) => (
        <p key={i} style={{ margin: "10px 0", lineHeight: "1.6" }}>{p}</p>
      ))}
    </div>
  );
}
