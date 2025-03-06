
export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />

      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500 opacity-20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Lignes de code animées */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full max-w-4xl max-h-96 opacity-10">
          <pre className="text-green-500 text-xs leading-3 animate-scroll-y overflow-hidden h-full">
            {`
function hackSystem() {
  const target = findVulnerableSystem();
  if (target) {
    const exploit = createExploit(target);
    const success = deployExploit(exploit);
    if (success) {
      console.log("Access granted");
      const data = extractSensitiveData();
      secureConnection();
      transmitData(data);
      coverTracks();
    } else {
      console.log("Exploit failed");
    }
  } else {
    console.log("No vulnerable systems found");
  }
}

function ethicalHack() {
  const permission = getPermission();
  if (permission) {
    const vulnerabilities = scanSystem();
    reportVulnerabilities(vulnerabilities);
    proposeSecurityMeasures();
  } else {
    console.log("Permission denied");
  }
}

// Repeat the above code multiple times to fill the space
`.repeat(10)}
          </pre>
        </div>
      </div>

      {/* Cercles pulsants */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-purple-500 opacity-20"
            style={{
              width: "200px",
              height: "200px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${Math.random() * 4 + 6}s linear infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

