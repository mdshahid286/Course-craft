from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Apply global theme for professional look
        self.camera.background_color = "#0f172a"
        

        # Scene 1: Introduction
        title = Text("Python Variables", font_size=50, color="#ffffff").set_stroke(width=2, color="#3b82f6").to_edge(UP)
        self.play(Write(title, run_time=2))
        self.wait(1)

        intro_text = Text("Variables are like containers for data.", font_size=30, color="#ffffff").next_to(title, DOWN, buff=0.8)
        self.play(Write(intro_text, run_time=2))
        self.wait(1.5)

        # Scene 2: Integer Variable
        code_score_assign = Text("score = 100", font_size=35, color="#ffffff").to_edge(LEFT).shift(UP*0.5)
        score_box_label = Text("score", font_size=25, color="#ffffff").next_to(code_score_assign, RIGHT, buff=1.5)
        score_box = Rectangle(width=2, height=1.2, color=BLUE).move_to(score_box_label.get_center())
        score_value = Text("100", font_size=30, color=YELLOW).move_to(score_box.get_center())

        self.play(Write(code_score_assign, run_time=2))
        self.play(
            Create(score_box),
            Write(score_box_label, run_time=2)
        )
        self.play(Write(score_value, run_time=2))
        self.wait(1)

        # Scene 3: String Variable
        code_name_assign = Text("name = \"Alice\"", font_size=35, color="#ffffff").next_to(code_score_assign, DOWN, buff=0.8, aligned_edge=LEFT)
        name_box_label = Text("name", font_size=25, color="#ffffff").next_to(code_name_assign, RIGHT, buff=1.5)
        name_box = Rectangle(width=2.5, height=1.2, color=GREEN).move_to(name_box_label.get_center())
        name_value = Text("\"Alice\"", font_size=30, color=YELLOW).move_to(name_box.get_center())

        self.play(Write(code_name_assign, run_time=2))
        self.play(
            Create(name_box),
            Write(name_box_label, run_time=2)
        )
        self.play(Write(name_value, run_time=2))
        self.wait(1)

        # Scene 4: Boolean Variable
        code_active_assign = Text("is_active = True", font_size=35, color="#ffffff").next_to(code_name_assign, DOWN, buff=0.8, aligned_edge=LEFT)
        active_box_label = Text("is_active", font_size=25, color="#ffffff").next_to(code_active_assign, RIGHT, buff=1.5)
        active_box = Rectangle(width=2.5, height=1.2, color=PURPLE).move_to(active_box_label.get_center())
        active_value = Text("True", font_size=30, color=YELLOW).move_to(active_box.get_center())

        self.play(Write(code_active_assign, run_time=2))
        self.play(
            Create(active_box),
            Write(active_box_label, run_time=2)
        )
        self.play(Write(active_value, run_time=2))
        self.wait(1)

        # Scene 5: Reassignment
        self.play(FadeOut(intro_text, scale=0.8)) # Clear some space

        reassign_text = Text("Variables can be reassigned.", font_size=30, color="#ffffff").next_to(title, DOWN, buff=0.8)
        self.play(Write(reassign_text, run_time=2))
        self.wait(1)

        code_score_reassign = Text("score = 150", font_size=35, color="#ffffff").next_to(code_active_assign, DOWN, buff=0.8, aligned_edge=LEFT)
        new_score_value = Text("150", font_size=30, color=YELLOW).move_to(score_box.get_center())

        self.play(Write(code_score_reassign, run_time=2))
        self.play(Transform(score_value, new_score_value))
        self.wait(2)

        self.play(
            FadeOut(title, scale=0.8),
            FadeOut(reassign_text, scale=0.8),
            FadeOut(code_score_assign, scale=0.8),
            FadeOut(code_name_assign, scale=0.8),
            FadeOut(code_active_assign, scale=0.8),
            FadeOut(code_score_reassign, scale=0.8),
            FadeOut(score_box_label, scale=0.8),
            FadeOut(score_box, scale=0.8),
            FadeOut(score_value, scale=0.8),
            FadeOut(name_box_label, scale=0.8),
            FadeOut(name_box, scale=0.8),
            FadeOut(name_value, scale=0.8),
            FadeOut(active_box_label, scale=0.8),
            FadeOut(active_box, scale=0.8),
            FadeOut(active_value, scale=0.8),
        )
        self.wait(1)
