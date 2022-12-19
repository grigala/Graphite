+++
title = "Features and roadmap"
template = "page.html"

[extra]
css = "/features.css"
+++

<section class="section-row">
<div class="section">

# Features and roadmap.

The current version of Graphite provides tools for designing vector art with Bezier curves, similar to tools like Inkscape, Illustrator, and Affinity Designer. These creations may be exported to SVG, JPG, or PNG formats. External images may be imported and placed in the document as a layer (but not directly edited yet).

The present priority is building the node graph system and integrating it with the existing vector editing toolset. Once ready, work will shift to building a raster-based render engine. More advanced features will build off those core capabilities.

Short-term feature development at a granular level is tracked in the [Task Board](https://github.com/GraphiteEditor/Graphite/projects/1) on GitHub. Check that out to see what's coming down the pipeline during monthly sprints. Graphite does not use formal version numbers because of the constant rate of feature development and continuous release cycle. Changes can be tracked by [commit hash](https://github.com/GraphiteEditor/Graphite/commits/master) and progress divided into [monthly sprints](https://github.com/GraphiteEditor/Graphite/milestones). The hosted web app deploys a [recent commit](https://github.com/GraphiteEditor/Graphite/releases/tag/latest-stable) from the past week or two.

</div>
</section>

<section id="opener-message" class="section-row right">
	<div class="graphic">
		<img src="https://static.graphite.rs/content/index/brush__2.svg" alt="" />
	</div>
	<div class="section">
		<h1>Professional 2D content creation for everyone.</h1>
		<p>
			With great power comes great accessibility. Graphite is built on the belief that the best creative tools can be powerful and within reach of all.
		</p>
		<p>
			Graphite is designed with a friendly and intuitive interface where a delightful user experience is of first-class importance. It is available for free under an open source
			<a href="/license" target="_blank">license</a>
			and usable
			<a href="https://editor.graphite.rs">instantly through a web browser</a>
			or an upcoming native client on Windows, Mac, and Linux.
		</p>
		<p>
			The accessible design of Graphite does not sacrifice versatility for simplicity. The node-based workflow (coming soon) will open doors to an ecosystem of powerful capabilities catering to
			the casual and professional user alike, encompassing a wide set of use cases at every skill level.
		</p>
		<!-- <a href="/blog/mission-statement" class="link arrow">Mission Statement</a> -->
	</div>
</section>

<section id="available-now" class="section-row left">
	<div class="graphic">
		<img src="https://static.graphite.rs/content/index/alpha.svg" alt="" />
	</div>
	<div class="section">
		<h1>Available now for alpha testing.</h1>
		<p>
			One year ago, Graphite was merely an idea. Today, the first milestone of the alpha release series is available for testing.
		</p>
		<p>
			Milestone 1 focused on building an editor interface with basic vector design and illustration tools. Now the alpha release series moves toward Milestone 2: developing a novel node-based
			vector graphics workflow. After that, raster graphics and more are planned in the <a href="/features">roadmap</a>.
		</p>
		<p>
			Features and fixes will continue rolling out every few days. Please report bugs and vote on issue prioritization <a href="https://github.com/GraphiteEditor/Graphite/projects/1">through
				GitHub</a>. While you're there, give the project a star to help grow its momentum.
		</p>
		<p>
			Try Graphite instantly in your browser:
		</p>
		<a href="https://editor.graphite.rs" class="link arrow">Launch the Editor</a>
	</div>
</section>


<section id="upcoming-tech" class="feature-box">
	<div class="box">
		<h1 class="box-header">Upcoming Tech <span> / </span> <a href="/features" class="link arrow">More in the Roadmap</a></h1>
		<hr />
		<div class="triptych">
			<div class="section">
				<h2 class="balance-text">Non-destructive editing, powered by nodes.</h2>
				<!-- <div class="graphic">
					<img src="graphic.svg" alt="" />
				</div> -->
				<p>While working in Graphite, your edits are saved into the <em>Node Graph</em>. Its <em>nodes</em> represent operations and effects like Magic Wand selection and Blur. Node <em>parameters</em> can be altered anytime, helping you iterate faster. The graph is organized into layers and folders, and a layer panel provides a simpler, compact view of the graph.</p>
				<!-- <a href="/blog/node-graph-explained" class="link arrow">Node Graph</a> -->
			</div>
			<div class="section">
				<h2 class="balance-text">Raster and vector art, crisp at any resolution.</h2>
				<!-- <div class="graphic">
					<img src="graphic.svg" alt="" />
				</div> -->
				<p>Just like <em>vector</em> artwork, which is based on curves instead of pixels to preserve quality at any scale, Graphite's <em>raster</em> paintbrushes, generators, and other tools
					work the same way. A <em>resolution-agnostic</em> render engine lets you zoom infinitely and export at any size.</p>
				<!-- <a href="/blog/rendering-pipeline-explained" class="link arrow">Rendering</a> -->
			</div>
			<div class="section">
				<h2 class="balance-text">Procedural superpowers, part of your art pipeline.</h2>
				<!-- <div class="graphic">
					<img src="graphic.svg" alt="" />
				</div> -->
				<p>Graphite aims to be the ultimate 2D tool for every technical artist. From procedural artwork to data viz and automation, it is designed from the ground up to fit into studio content
					pipelines. You can also integrate Graphite's render engine into your game, app, or server.</p>
				<!-- <a href="/blog/graphene-explained" class="link arrow">Graphene</a> -->
			</div>
		</div>
		<div class="section-row right">
			<!-- <div class="graphic">
				<img src="graphic.svg" alt="" />
			</div> -->
			<div class="section">
				<h2>More to come.</h2>
				<p>
					RAW photo editing. Procedural texture generation. Advanced typesetting and desktop publishing. Motion graphics and animation. Physically-based digital painting. HDR and wide-gamut
					color handling (ACES/OpenColorIO). Real-time collaboration. A rich ecosystem of custom nodes.
				</p>
				<p>
					Learn more about the planned technology in forthcoming Graphite releases:
				</p>
				<a href="/features" class="link arrow">Features</a>
			</div>
		</div>
	</div>
</section>

<section class="section-row">
<div class="section">

## Milestones

Release series are announced based on major technology readiness milestones. Following a year of pre-alpha development, alpha milestone 1 was [announced](https://graphite.rs/blog/announcing-graphite-alpha/) and work has continued under that banner while progressing towards the features of the second milestone release.

- Alpha Milestone 1 is the current release series available at [editor.graphite.rs](https://editor.graphite.rs) which encompasses minimum-viable-product (MVP) vector editing features. Features and improvements are continually added and deployed. Regrettably, file format stability isn't guaranteed at this stage since it would prohibitively hinder the pace of development.

- Alpha Milestone 2 is the next release series. It will introduce the node graph system for procedural vector editing. This is expected to be ready before the end of 2022.

- Alpha Milestone 3 will probably focus on switching to an in-house vector graphics render engine built on [wgpu](https://wgpu.rs/).

- Alpha Milestone 4 will probably introduce raster compositing.

- Beta versions will follow once basic procedural vector and raster editing is fully supported. File format stability, authoring + sharing custom nodes/extensions, and a downloadable native desktop client will be included during or before Beta.

- RAW photo editing, advanced color handling, automation and batch processing, and procedural painting workflows will be added during further Beta development.

## Planned capabilities

Below is an incomplete list of planned features and longer-term aspirations.

Short Term:
- Node graph and layer tree
- Procedural generation
- Importing SVG files

Medium Term:
- Mixed vector and raster workflow
- Compositing engine
- Resolution-agnostic rendering
- RAW photo editing
- HDR/WCG color handling
- Data viz/graph/chart creation
- Data-driven template replacement
- Advanced typesetting
- Procedural painting
- CAD-like constraint solver
- Real-time collaborative editing
- Custom node scripting
- Asset manager and store
- Batch conversion and processing
- Portable render engine
- Localization/internationalization
- Keyboardless touch and stylus controls
- Native desktop application

Long Term:
- Physically-based painting
- Motion graphics and animation
- Live video compositing
- Animated SVG authorship
- Distributed rendering system

</div>
</section>
