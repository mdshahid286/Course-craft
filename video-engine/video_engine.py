"""
Visual-first educational explainer video engine.
Focuses on diagrams, graphs, and animations with minimal supporting text.
"""

import argparse
import json
import os
import subprocess
from pathlib import Path

from manim import *  # noqa: F403


# Global Theme
THEME = {
    "bg": "#0f172a",
    "primary": BLUE_B,  # noqa: F405
    "secondary": GREEN_B,  # noqa: F405
    "highlight": YELLOW,  # noqa: F405
    "text": WHITE,  # noqa: F405
}

# Font with fallback: DejaVu Sans always ships with Manim
FONT_FAMILY = os.environ.get("MANIM_FONT", "DejaVu Sans")

# Safe layout spacing
SAFE_EDGE_BUFF = 0.9
STACK_BUFF = 1.2
VISUAL_CENTER_OFFSET = DOWN * 0.3  # Slight downward shift for main visuals


def load_script(path: Path):
    """JSON reading logic unchanged."""
    with path.open() as f:
        return json.load(f)


def clamp_width(mob: Mobject, max_width: float) -> Mobject:  # noqa: F405
    """Ensure a mobject fits within max_width (no overflow)."""
    if mob.width > max_width:
        mob.scale_to_fit_width(max_width)
    return mob


def make_title(text: str) -> Text:  # noqa: F405
    """Title styling: bold via stroke, larger scale, theme primary color."""
    t = Text(text, font=FONT_FAMILY, color=THEME["primary"])  # noqa: F405
    t.scale(1.2)
    t.set_stroke(color=THEME["primary"], width=2, opacity=0.9)
    return t


def make_body(text: str, scale: float = 0.85) -> Text:  # noqa: F405
    """Body text styling - minimal supporting text."""
    t = Text(text, font=FONT_FAMILY, color=THEME["text"])
    t.scale(scale)
    return t


def fade_out_cinematic(mob: Mobject, run_time: float = 0.7):  # noqa: F405
    """Scene transition: slight scale-down + fade out."""
    return AnimationGroup(  # noqa: F405
        mob.animate.scale(0.92).set_opacity(0.0),
        lag_ratio=0.0,
        run_time=run_time,
    )


# ============================================================================
# Modular Scene Rendering Functions
# ============================================================================


def render_text_scene(scene: dict, title: Mobject, max_text_w: float, self: Scene) -> VGroup:  # noqa: F405
    """
    Render text scene with minimal supporting text.
    Text appears below title, shifts upward instead of abrupt removal.
    """
    narration = (scene.get("narration") or scene.get("content") or "").strip()
    if not narration:
        return VGroup()  # noqa: F405

    # Keep text short and focused
    body = make_body(narration, scale=0.8)
    clamp_width(body, max_text_w)
    body.next_to(title, DOWN, buff=STACK_BUFF)

    # Clear previous non-title content
    leftovers = [m for m in self.mobjects if m is not title]
    if leftovers:
        self.play(*[fade_out_cinematic(m) for m in leftovers], run_time=0.6)

    self.play(Write(body, run_time=2.0))  # noqa: F405
    self.wait(0.8)

    # Shift upward instead of abrupt removal
    self.play(body.animate.shift(UP * 1.2).set_opacity(0.3).scale(0.95), run_time=0.7)
    self.wait(0.2)

    return VGroup(body)  # noqa: F405


def render_process_threads_scene(scene: dict, title: Mobject, max_text_w: float, self: Scene) -> VGroup:  # noqa: F405
    """
    Visual explanation: Process box containing two Thread boxes.
    Threads appear one-by-one, arrows highlight relationships.
    Minimal supporting text appears after visual.
    """
    # Clear previous content
    leftovers = [m for m in self.mobjects if m is not title]
    if leftovers:
        self.play(*[fade_out_cinematic(m) for m in leftovers], run_time=0.6)

    # Outer Process box
    process_box = RoundedRectangle(corner_radius=0.3, width=10, height=4.5)  # noqa: F405
    process_box.set_stroke(THEME["primary"], width=4)
    process_box.set_fill(THEME["primary"], opacity=0.12)
    process_box.move_to(ORIGIN).shift(VISUAL_CENTER_OFFSET)

    process_label = Text("Process", font=FONT_FAMILY, color=THEME["primary"])  # noqa: F405
    process_label.scale(1.0)
    process_label.set_stroke(color=THEME["primary"], width=1.5, opacity=0.8)
    process_label.next_to(process_box.get_top(), DOWN, buff=0.4)

    # Thread boxes inside
    thread_style = dict(corner_radius=0.2, width=4.5, height=1.8)
    thread_a = RoundedRectangle(**thread_style)  # noqa: F405
    thread_a.set_stroke(THEME["secondary"], width=3.5)
    thread_a.set_fill(THEME["secondary"], opacity=0.15)
    thread_a_label = Text("Thread 1", font=FONT_FAMILY, color=THEME["secondary"])  # noqa: F405
    thread_a_label.scale(0.8)
    thread_a_label.set_stroke(color=THEME["secondary"], width=1.2, opacity=0.8)
    thread_a_label.move_to(thread_a.get_center())

    thread_b = RoundedRectangle(**thread_style)  # noqa: F405
    thread_b.set_stroke(THEME["secondary"], width=3.5)
    thread_b.set_fill(THEME["secondary"], opacity=0.15)
    thread_b_label = Text("Thread 2", font=FONT_FAMILY, color=THEME["secondary"])  # noqa: F405
    thread_b_label.scale(0.8)
    thread_b_label.set_stroke(color=THEME["secondary"], width=1.2, opacity=0.8)
    thread_b_label.scale(0.8).move_to(thread_b.get_center())

    threads_group = VGroup(  # noqa: F405
        VGroup(thread_a, thread_a_label),
        VGroup(thread_b, thread_b_label),
    ).arrange(RIGHT, buff=1.2)
    threads_group.move_to(process_box.get_center())

    # Arrow between threads (highlight color)
    arrow = Arrow(  # noqa: F405
        start=thread_a.get_right(),
        end=thread_b.get_left(),
        buff=0.2,
        stroke_width=7,
        color=THEME["highlight"],
    )

    diagram = VGroup(process_box, process_label, threads_group, arrow)  # noqa: F405
    diagram.move_to(ORIGIN).shift(VISUAL_CENTER_OFFSET)

    # Step-by-step reveal
    self.play(FadeIn(process_box, scale=0.95), run_time=0.8)
    self.play(Write(process_label, run_time=1.0))
    self.wait(0.3)

    # Threads appear one-by-one
    self.play(GrowFromCenter(threads_group[0]), run_time=0.7)  # noqa: F405
    self.wait(0.2)
    self.play(GrowFromCenter(threads_group[1]), run_time=0.7)  # noqa: F405
    self.wait(0.3)

    # Arrow appears
    self.play(Create(arrow, run_time=0.8))  # noqa: F405
    self.wait(0.2)

    # Highlight arrow to guide focus
    self.play(Indicate(arrow, color=THEME["highlight"], scale_factor=1.15), run_time=1.0)  # noqa: F405
    self.wait(0.4)

    # Minimal supporting text below diagram
    support_text = scene.get("narration") or scene.get("content") or "A process can contain multiple threads that run concurrently."
    support = make_body(support_text, scale=0.75)
    clamp_width(support, max_text_w)
    support.next_to(diagram, DOWN, buff=1.0)

    self.play(Write(support, run_time=2.0))
    self.wait(0.6)

    # Transition-ready
    self.play(VGroup(diagram, support).animate.scale(0.96).set_opacity(0.5), run_time=0.6)  # noqa: F405

    return VGroup(diagram, support)  # noqa: F405


def render_derivative_graph_scene(scene: dict, title: Mobject, max_text_w: float, self: Scene) -> VGroup:  # noqa: F405
    """
    Visual explanation: Axes, curve, point, tangent line.
    Highlights slope visually. Minimal supporting text.
    """
    # Clear previous content
    leftovers = [m for m in self.mobjects if m is not title]
    if leftovers:
        self.play(*[fade_out_cinematic(m) for m in leftovers], run_time=0.6)

    # Create simple axes using Lines (no LaTeX)
    origin = ORIGIN + VISUAL_CENTER_OFFSET + DOWN * 1.5
    x_axis = Line(  # noqa: F405
        origin + LEFT * 4,
        origin + RIGHT * 4,
        color=THEME["text"],
        stroke_width=3,
    )
    y_axis = Line(  # noqa: F405
        origin + DOWN * 2.5,
        origin + UP * 2.5,
        color=THEME["text"],
        stroke_width=3,
    )

    # Simple upward curve (parabola-like shape using bezier)
    curve_start = origin + LEFT * 3 + DOWN * 0.5
    curve_mid = origin + UP * 0.5
    curve_end = origin + RIGHT * 3 + UP * 1.5
    curve = CubicBezier(  # noqa: F405
        curve_start,
        curve_start + UP * 0.8 + RIGHT * 1,
        curve_end + DOWN * 0.8 + LEFT * 1,
        curve_end,
        color=THEME["primary"],
        stroke_width=5,
    )

    # Point on curve (at x=1.5 equivalent)
    point_pos = origin + RIGHT * 1.5 + UP * 0.8
    point = Dot(point_pos, color=THEME["highlight"], radius=0.15)  # noqa: F405

    # Tangent line (slope visualization)
    slope = 0.5  # visual slope
    tangent_start = point_pos + LEFT * 2 + DOWN * slope * 2
    tangent_end = point_pos + RIGHT * 2 + UP * slope * 2
    tangent = Line(  # noqa: F405
        tangent_start,
        tangent_end,
        color=THEME["highlight"],
        stroke_width=6,
    )

    # Slope indicator (right triangle showing rise/run)
    triangle_base = 1.2
    triangle_height = slope * triangle_base
    triangle_points = [
        point_pos,
        point_pos + RIGHT * triangle_base,
        point_pos + RIGHT * triangle_base + UP * triangle_height,
    ]
    slope_indicator = Polygon(*triangle_points, color=THEME["highlight"], fill_opacity=0.5, stroke_width=3)  # noqa: F405

    graph_group = VGroup(x_axis, y_axis, curve, point, tangent, slope_indicator)  # noqa: F405
    graph_group.move_to(ORIGIN).shift(VISUAL_CENTER_OFFSET)

    # Step-by-step reveal
    self.play(Create(x_axis), Create(y_axis), run_time=1.0)  # noqa: F405
    self.wait(0.3)

    self.play(Create(curve, run_time=2.0))  # noqa: F405
    self.wait(0.4)

    self.play(FadeIn(point, scale=1.5), run_time=0.6)  # noqa: F405
    self.wait(0.3)

    self.play(Create(tangent, run_time=1.2))  # noqa: F405
    self.wait(0.2)

    self.play(FadeIn(slope_indicator, scale=0.9), run_time=0.8)  # noqa: F405
    self.wait(0.3)

    # Highlight slope to guide focus
    self.play(Indicate(slope_indicator, color=THEME["highlight"]), run_time=1.0)  # noqa: F405
    self.wait(0.4)

    # Minimal supporting text
    support_text = scene.get("narration") or scene.get("content") or "Derivative = slope at a point"
    support = make_body(support_text, scale=0.75)
    clamp_width(support, max_text_w)
    support.next_to(graph_group, DOWN, buff=1.0)

    self.play(Write(support, run_time=2.0))
    self.wait(0.6)

    # Transition-ready
    self.play(VGroup(graph_group, support).animate.scale(0.96).set_opacity(0.5), run_time=0.6)  # noqa: F405

    return VGroup(graph_group, support)  # noqa: F405


def render_car_speed_scene(scene: dict, title: Mobject, max_text_w: float, self: Scene) -> VGroup:  # noqa: F405
    """
    Visual explanation: Road line, car icon moves, speed meter needle rotates.
    Minimal supporting text.
    """
    # Clear previous content
    leftovers = [m for m in self.mobjects if m is not title]
    if leftovers:
        self.play(*[fade_out_cinematic(m) for m in leftovers], run_time=0.6)

    # Road line (horizontal)
    road = Line(  # noqa: F405
        LEFT * 5,
        RIGHT * 5,
        color=THEME["text"],
        stroke_width=8,
    )
    road.shift(DOWN * 1.5)

    # Car icon (simple rectangle with wheels - no external image needed)
    car_body = RoundedRectangle(  # noqa: F405
        width=1.8,
        height=0.8,
        corner_radius=0.15,
        color=THEME["primary"],
        fill_opacity=0.9,
    )
    car_wheel1 = Circle(radius=0.15, color=THEME["text"], fill_opacity=1.0)  # noqa: F405
    car_wheel2 = Circle(radius=0.15, color=THEME["text"], fill_opacity=1.0)  # noqa: F405
    car_wheel1.move_to(car_body.get_bottom() + LEFT * 0.5 + DOWN * 0.15)
    car_wheel2.move_to(car_body.get_bottom() + RIGHT * 0.5 + DOWN * 0.15)
    car = VGroup(car_body, car_wheel1, car_wheel2)  # noqa: F405
    car.move_to(road.get_start() + UP * 0.5)

    # Speed meter (semicircle gauge)
    meter_center = ORIGIN + RIGHT * 3.5 + UP * 0.5
    meter_arc = Arc(  # noqa: F405
        radius=1.2,
        start_angle=PI,  # noqa: F405
        angle=PI,  # noqa: F405
        color=THEME["secondary"],
        stroke_width=6,
    ).move_to(meter_center)

    # Needle (starts at left, rotates to right as speed increases)
    needle_start = meter_center + LEFT * 1.2
    needle = Line(  # noqa: F405
        meter_center,
        needle_start,
        color=THEME["highlight"],
        stroke_width=5,
    )

    # Speed labels
    speed_label_0 = Text("0", font=FONT_FAMILY, color=THEME["text"], font_size=24)  # noqa: F405
    speed_label_0.next_to(meter_arc.get_left(), DOWN, buff=0.2)
    speed_label_max = Text("100", font=FONT_FAMILY, color=THEME["text"], font_size=24)  # noqa: F405
    speed_label_max.next_to(meter_arc.get_right(), DOWN, buff=0.2)

    visual_group = VGroup(road, car, meter_arc, needle, speed_label_0, speed_label_max)  # noqa: F405
    visual_group.move_to(ORIGIN).shift(VISUAL_CENTER_OFFSET)

    # Step-by-step reveal
    self.play(Create(road, run_time=1.0))  # noqa: F405
    self.wait(0.2)

    self.play(FadeIn(car, scale=0.9), run_time=0.8)  # noqa: F405
    self.wait(0.3)

    self.play(Create(meter_arc), Write(speed_label_0), Write(speed_label_max), run_time=1.2)  # noqa: F405
    self.wait(0.2)

    self.play(Create(needle, run_time=0.8))  # noqa: F405
    self.wait(0.3)

    # Car moves along road
    self.play(car.animate.shift(RIGHT * 4), run_time=2.5)  # noqa: F405
    self.wait(0.2)

    # Needle rotates (speed increases)
    self.play(Rotate(needle, -PI / 2, about_point=meter_center), run_time=1.5)  # noqa: F405
    self.wait(0.3)

    # Highlight relationship
    self.play(Indicate(car, color=THEME["highlight"]), Indicate(needle, color=THEME["highlight"]), run_time=1.2)  # noqa: F405
    self.wait(0.4)

    # Minimal supporting text
    support_text = scene.get("narration") or scene.get("content") or "Speed is rate of change of position"
    support = make_body(support_text, scale=0.75)
    clamp_width(support, max_text_w)
    support.next_to(visual_group, DOWN, buff=1.0)

    self.play(Write(support, run_time=2.0))
    self.wait(0.6)

    # Transition-ready
    self.play(VGroup(visual_group, support).animate.scale(0.96).set_opacity(0.5), run_time=0.6)  # noqa: F405

    return VGroup(visual_group, support)  # noqa: F405


# ============================================================================
# Scene Type Detection
# ============================================================================


def scene_kind(scene: dict) -> str:
    """
    Detect scene type from JSON without changing contract.
    Supports: "text", "diagram_process_threads", "graph_derivative", "real_world_car_speed"
    """
    t = (scene.get("type") or "").lower()
    if t:
        return t

    # Fallback: infer from visual description (check multiple fields)
    visual = (
        scene.get("visual")
        or scene.get("content")
        or scene.get("narration")
        or ""
    ).lower()
    if "process" in visual and "thread" in visual:
        return "diagram_process_threads"
    if "derivative" in visual or "slope" in visual or "tangent" in visual:
        return "graph_derivative"
    if "car" in visual or "speed" in visual or "meter" in visual:
        return "real_world_car_speed"

    return "text"


# ============================================================================
# Main Scene Class
# ============================================================================


class AutoScene(Scene):  # noqa: F405
    """
    Visual-first educational explainer renderer.
    Guarantees clean spacing, zero overlaps, cinematic pacing.
    """

    def __init__(self, script_path: str = None, **kwargs):
        super().__init__(**kwargs)
        self._script_path = script_path or os.environ.get("AUTO_SCENE_SCRIPT") or "script.json"
        self._script = None

    def setup(self):
        """Apply global theme."""
        self.camera.background_color = THEME["bg"]

    def construct(self):
        """Main rendering logic: visual-first with minimal text."""
        self._script = load_script(Path(self._script_path))
        title_str = self._script.get("title", "Untitled")
        scenes = self._script.get("scenes", [])

        frame_w = config.frame_width  # noqa: F405
        max_text_w = frame_w - (SAFE_EDGE_BUFF * 2)

        # Title (top-center, fade-in from below)
        title = make_title(title_str)
        clamp_width(title, max_text_w)
        title.to_edge(UP, buff=SAFE_EDGE_BUFF)
        title.shift(DOWN * 0.4)
        self.play(FadeIn(title, shift=DOWN * 0.4), run_time=1.2)  # noqa: F405
        self.wait(0.3)

        # Slight title adjustment for first scene
        self.play(title.animate.shift(UP * 0.2).scale(0.98), run_time=0.5)

        # Render each scene using modular functions
        for idx, sc in enumerate(scenes):
            kind = scene_kind(sc)

            # Route to appropriate renderer
            if kind == "diagram_process_threads":
                render_process_threads_scene(sc, title, max_text_w, self)
            elif kind == "graph_derivative":
                render_derivative_graph_scene(sc, title, max_text_w, self)
            elif kind == "real_world_car_speed":
                render_car_speed_scene(sc, title, max_text_w, self)
            else:  # "text" or fallback
                render_text_scene(sc, title, max_text_w, self)

            # Subtle title adjustment between scenes
            if idx < len(scenes) - 1:
                self.play(title.animate.shift(UP * 0.1), run_time=0.3)

        # Final fade out
        self.play(*[fade_out_cinematic(m) for m in self.mobjects], run_time=1.0)
        self.wait(0.2)


# ============================================================================
# CLI Entrypoint (unchanged)
# ============================================================================


def render_video(script_path: str):
    """
    CLI entrypoint used by Node: render AutoScene with the provided script.
    Prints a final JSON line with video_path to stdout.
    """
    script = load_script(Path(script_path))
    title = script.get("title", "Untitled")
    print("Loaded script:", title)

    script_p = Path(script_path)
    job_id = script_p.stem.replace("script-", "")
    
    # Use a unique subdirectory for this specific job to avoid collisions
    output_dir = Path(__file__).parent / "output"
    job_dir = output_dir / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    # Quality flag
    quality = os.environ.get("MANIM_QUALITY", "ql")

    env = os.environ.copy()
    env["AUTO_SCENE_SCRIPT"] = str(script_p.resolve())

    cmd = [
        "manim",
        f"-{quality}",
        str(Path(__file__).resolve()),
        "AutoScene",
        "--media_dir",
        str(job_dir),
    ]

    print(f"[Engine] Rendering job {job_id} into {job_dir}...")
    proc = subprocess.run(cmd, capture_output=True, text=True, env=env)
    
    if proc.returncode != 0:
        error_msg = proc.stderr.strip() or "manim failed"
        print(f"[Engine] FAILED: {error_msg}")
        raise RuntimeError(error_msg)

    # Find the generated mp4 (usually in job_dir/videos/video_engine/...)
    mp4s = sorted(job_dir.rglob("*.mp4"), key=lambda p: p.stat().st_mtime, reverse=True)
    out_path = str(mp4s[0]) if mp4s else ""
    
    print(json.dumps({"status": "rendered", "video_path": out_path, "job_id": job_id}))


def parse_args():
    parser = argparse.ArgumentParser(description="Run Manim video engine")
    parser.add_argument("script", nargs="?", default="script.json", help="Path to script JSON (default: script.json)")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    render_video(args.script)
