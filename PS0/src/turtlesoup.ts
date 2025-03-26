import { Turtle, SimpleTurtle, Point, Color } from "./turtle";
import * as fs from "fs";
import { execSync } from "child_process";

export function drawSquare(turtle: Turtle, sideLength: number): void {
  for (let i = 0; i < 4; i++) {
    turtle.forward(sideLength);
    turtle.turn(90);
  }
}

export function chordLength(radius: number, angleInDegrees: number): number {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return Number((2 * radius * Math.sin(angleInRadians / 2)).toFixed(10))
}

export function drawApproximateCircle(
  turtle: Turtle,
  radius: number,
  numSides: number
): void {
  const anglePerSegment = 360 / numSides;
  const stepSize = chordLength(radius, anglePerSegment);

  for (let i = 0; i < numSides; i++) {
    turtle.forward(stepSize);
    turtle.turn(anglePerSegment);
  }
}

export function distance(p1: Point, p2: Point): number {
  const deltaX = p2.x - p1.x;
  const deltaY = p2.y - p1.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

export function findPath(turtle: Turtle, points: Point[]): string[] {
  let commands: string[] = [];
  let position = turtle.getPosition();
  let heading = turtle.getHeading();

  points.forEach(target => {
    const deltaX = target.x - position.x;
    const deltaY = target.y - position.y;
    const targetAngle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const angleToTurn = ((targetAngle - heading + 360) % 360);

    commands.push(`turn ${angleToTurn.toFixed(2)}`);
    commands.push(`forward ${distance(position, target).toFixed(2)}`);

    position = target;
    heading = targetAngle;
  });

  return commands;
}

export function drawPersonalArt(turtle: Turtle): void {
  let currentLength = 100;
  let shift = 7;
  let angle = 45;
  let iterations = 10;

  turtle.color("red");
  for (let i = 0; i < iterations; i++) {
    turtle.forward(currentLength);
    turtle.turn(90 - angle);
    turtle.color("magenta");
    turtle.forward(currentLength);
    turtle.turn(90 - angle);
  
    currentLength -= shift;
  }
  
  currentLength = 100;
  turtle.color("red");
  for (let i = 0; i < iterations; i++) {
    turtle.forward(currentLength);
    turtle.turn(90 - angle);
    turtle.color("blue");
    turtle.forward(currentLength);
    turtle.turn(90 - angle);
  
    currentLength -= shift;
  }
  
  turtle.color("purple");
  currentLength = 50;
  for (let i = 0; i < 6; i++) {
    turtle.forward(currentLength);
    turtle.turn(45);
    turtle.color("yellow");
    turtle.forward(currentLength * 0.8);
    turtle.turn(45);
  
    currentLength -= shift; 
  }
  turtle.color("cyan");
  turtle.forward(currentLength / 2);
  turtle.turn(45);
  turtle.forward(currentLength / 2);
}

function generateHTML(
  pathData: { start: Point; end: Point; color: Color }[]
): string {
  const canvasWidth = 500;
  const canvasHeight = 500;
  const scale = 1; // Adjust scale as needed
  const offsetX = canvasWidth / 2; // Center the origin
  const offsetY = canvasHeight / 2; // Center the origin

  let pathStrings = "";
  for (const segment of pathData) {
    const x1 = segment.start.x * scale + offsetX;
    const y1 = segment.start.y * scale + offsetY;
    const x2 = segment.end.x * scale + offsetX;
    const y2 = segment.end.y * scale + offsetY;
    pathStrings += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${segment.color}" stroke-width="2"/>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
    <title>Turtle Graphics Output</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <svg width="${canvasWidth}" height="${canvasHeight}" style="background-color:#f0f0f0;">
        ${pathStrings}
    </svg>
</body>
</html>`;
}

function saveHTMLToFile(
  htmlContent: string,
  filename: string = "output.html"
): void {
  fs.writeFileSync(filename, htmlContent);
  console.log(`Drawing saved to ${filename}`);
}

function openHTML(filename: string = "output.html"): void {
  try {
    // For macOS
    execSync(`open ${filename}`);
  } catch {
    try {
      // For Windows
      execSync(`start ${filename}`);
    } catch {
      try {
        // For Linux
        execSync(`xdg-open ${filename}`);
      } catch {
        console.log("Could not open the file automatically");
      }
    }
  }
}

export function main(): void {
  const turtle = new SimpleTurtle();

  // Example Usage - Uncomment functions as you implement them

  // Draw a square
  // drawSquare(turtle, 100);

  // Example chordLength calculation (for testing in console)
  // console.log("Chord length for radius 5, angle 60 degrees:", chordLength(5, 60));

  // Draw an approximate circle
  // drawApproximateCircle(turtle, 50, 360);

  // // Example distance calculation (for testing in console)
  // const p1: Point = {x: 1, y: 2};
  // const p2: Point = {x: 4, y: 6};
  // console.log("Distance between p1 and p2:", distance(p1, p2));

  // Example findPath (conceptual - prints path to console)
  // const pointsToVisit: Point[] = [{x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}];
  // const pathInstructions = findPath(turtle, pointsToVisit);
  // console.log("Path instructions:", pathInstructions);

  // Draw personal art
  drawPersonalArt(turtle);

  const htmlContent = generateHTML((turtle as SimpleTurtle).getPath()); // Cast to access getPath
  saveHTMLToFile(htmlContent);
  openHTML();
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
