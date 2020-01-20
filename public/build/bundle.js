
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/UI/BackDrop.svelte generated by Svelte v3.16.7 */

    const file = "src/UI/BackDrop.svelte";

    function create_fragment(ctx) {
    	let div;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", "black-drop");
    			attr_dev(div, "class", "svelte-1wi4oif");
    			add_location(div, file, 4, 0, 21);
    			dispose = listen_dev(div, "click", /*click_handler*/ ctx[0], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self) {
    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [click_handler];
    }

    class BackDrop extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BackDrop",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const players = writable([]);


    const playerStore = {
      subscribe: players.subscribe,

      setPlayers: existingPlayers => {
        players.set(existingPlayers);
      },

      payPot: (name, amount) => {
        players.update(items => {
          const payerIndex = items.findIndex(player => player.name === name);
          const updatedPlayers = [...items];
          const updatedPayer = {...items[payerIndex]};
          updatedPayer.money -= parseInt(amount);
          updatedPlayers[payerIndex] = updatedPayer;
          return updatedPlayers.sort(
            (a,b) => a.money < b.money ? 1 : -1
          );
        });
      },

      collectPot: (selectedPlayer, amount) => {
        players.update(items => {
          const payeeIndex = items.findIndex(player => player.name === selectedPlayer);
          const updatedPlayers = [...items];
          const updatedPayee = {...items[payeeIndex]};
          console.log(updatedPayee);
          console.log(updatedPlayers);
          updatedPayee.money += parseInt(amount);
          updatedPlayers[payeeIndex] = updatedPayee;
          return updatedPlayers.sort(
            (a,b) => a.money < b.money ? 1 : -1
          );
        });
      },

      payPlayer: (name, selectedPlayer, amount) => {
        players.update(items => {
          const updatedPlayers = [...items];

          const payerIndex = items.findIndex(player => player.name === name);
          const updatedPayer = {...items[payerIndex]};
          updatedPayer.money -= amount;
          updatedPlayers[payerIndex] = updatedPayer;

          if (selectedPlayer !== 'bank') {
            const payeeIndex = items.findIndex(player => player.name === selectedPlayer);
            const updatedPayee = {...items[payeeIndex]};
            updatedPayee.money += amount;
            updatedPlayers[payeeIndex] = updatedPayee;
          }

          return updatedPlayers.sort(
            (a,b) => a.money < b.money ? 1 : -1
          );

        });
      },

      bankrupt: name => {
        players.update(players => {
          let updatedPlayers = [...players];
          updatedPlayers = updatedPlayers.filter(player => player.name !== name);
          return updatedPlayers;
        });
      }

    };

    const pot = writable(150);


    const potStore = {
      subscribe: pot.subscribe,

      collectPot: () => {
        pot.update(
          item => 0
        );
      },

      payPot: amount => {
        pot.update(
          item => item += amount
        );
      },

    };

    // export default pot;

    /* src/SelectPlayer.svelte generated by Svelte v3.16.7 */
    const file$1 = "src/SelectPlayer.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (44:4) {#if action === "Pay"}
    function create_if_block_2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*players*/ ctx[0];
    	const get_key = ctx => /*player*/ ctx[4].name;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			const each_value = /*players*/ ctx[0];
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block, each_1_anchor, get_each_context);
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(44:4) {#if action === \\\"Pay\\\"}",
    		ctx
    	});

    	return block;
    }

    // (45:6) {#each players as player (player.name)}
    function create_each_block(key_1, ctx) {
    	let button;
    	let t0;
    	let t1;
    	let t2_value = /*player*/ ctx[4].name + "";
    	let t2;
    	let t3;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			button = element("button");
    			t0 = text(/*action*/ ctx[1]);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(button, "class", "svelte-1d8zzgo");
    			add_location(button, file$1, 45, 8, 876);
    			dispose = listen_dev(button, "click", /*selectPlayer*/ ctx[6], false, false, false);
    			this.first = button;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*action*/ 2) set_data_dev(t0, /*action*/ ctx[1]);
    			if (dirty & /*players*/ 1 && t2_value !== (t2_value = /*player*/ ctx[4].name + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(45:6) {#each players as player (player.name)}",
    		ctx
    	});

    	return block;
    }

    // (57:35) 
    function create_if_block_1(ctx) {
    	let button;
    	let t0;
    	let t1;
    	let t2_value = /*players*/ ctx[0][0].name + "";
    	let t2;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(/*action*/ ctx[1]);
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(button, "class", "svelte-1d8zzgo");
    			add_location(button, file$1, 57, 6, 1153);
    			dispose = listen_dev(button, "click", /*selectPlayer*/ ctx[6], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*action*/ 2) set_data_dev(t0, /*action*/ ctx[1]);
    			if (dirty & /*players*/ 1 && t2_value !== (t2_value = /*players*/ ctx[0][0].name + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(57:35) ",
    		ctx
    	});

    	return block;
    }

    // (52:4) {#if players.length > 1}
    function create_if_block(ctx) {
    	let button;
    	let t0;
    	let t1;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(/*action*/ ctx[1]);
    			t1 = text(" all");
    			attr_dev(button, "class", "svelte-1d8zzgo");
    			add_location(button, file$1, 52, 6, 1031);
    			dispose = listen_dev(button, "click", /*selectPlayer*/ ctx[6], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*action*/ 2) set_data_dev(t0, /*action*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(52:4) {#if players.length > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let div;
    	let section;
    	let label;
    	let input;
    	let input_updating = false;
    	let t1;
    	let t2;
    	let t3;
    	let button0;
    	let t4;
    	let t5;
    	let t6;
    	let button1;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let button2;
    	let current;
    	let dispose;
    	const backdrop = new BackDrop({ $$inline: true });
    	backdrop.$on("click", /*closeModal*/ ctx[8]);

    	function input_input_handler() {
    		input_updating = true;
    		/*input_input_handler*/ ctx[10].call(input);
    	}

    	let if_block0 = /*action*/ ctx[1] === "Pay" && create_if_block_2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*players*/ ctx[0].length > 1) return create_if_block;
    		if (/*action*/ ctx[1] === "Collect") return create_if_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			create_component(backdrop.$$.fragment);
    			t0 = space();
    			div = element("div");
    			section = element("section");
    			label = element("label");
    			input = element("input");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			button0 = element("button");
    			t4 = text(/*action*/ ctx[1]);
    			t5 = text(" bank");
    			t6 = space();
    			button1 = element("button");
    			t7 = text(/*action*/ ctx[1]);
    			t8 = text(" Community Pot($");
    			t9 = text(/*$potStore*/ ctx[3]);
    			t10 = text(")");
    			t11 = space();
    			button2 = element("button");
    			button2.textContent = "Cancel";
    			attr_dev(input, "type", "number");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[5]);
    			attr_dev(input, "class", "svelte-1d8zzgo");
    			add_location(input, file$1, 38, 6, 702);
    			add_location(label, file$1, 37, 4, 688);
    			attr_dev(button0, "class", "svelte-1d8zzgo");
    			add_location(button0, file$1, 62, 4, 1261);
    			attr_dev(button1, "class", "svelte-1d8zzgo");
    			add_location(button1, file$1, 66, 4, 1340);
    			attr_dev(button2, "class", "cancel-button svelte-1d8zzgo");
    			add_location(button2, file$1, 70, 4, 1439);
    			attr_dev(section, "class", "svelte-1d8zzgo");
    			add_location(section, file$1, 36, 2, 674);
    			attr_dev(div, "class", "container svelte-1d8zzgo");
    			add_location(div, file$1, 35, 0, 648);

    			dispose = [
    				listen_dev(input, "input", input_input_handler),
    				listen_dev(button0, "click", /*selectPlayer*/ ctx[6], false, false, false),
    				listen_dev(button1, "click", /*selectPot*/ ctx[7], false, false, false),
    				listen_dev(button2, "click", /*closeModal*/ ctx[8], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(backdrop, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, section);
    			append_dev(section, label);
    			append_dev(label, input);
    			set_input_value(input, /*amount*/ ctx[2]);
    			append_dev(section, t1);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t2);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t3);
    			append_dev(section, button0);
    			append_dev(button0, t4);
    			append_dev(button0, t5);
    			append_dev(section, t6);
    			append_dev(section, button1);
    			append_dev(button1, t7);
    			append_dev(button1, t8);
    			append_dev(button1, t9);
    			append_dev(button1, t10);
    			append_dev(section, t11);
    			append_dev(section, button2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!input_updating && dirty & /*amount*/ 4) {
    				set_input_value(input, /*amount*/ ctx[2]);
    			}

    			input_updating = false;

    			if (/*action*/ ctx[1] === "Pay") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(section, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(section, t3);
    				}
    			}

    			if (!current || dirty & /*action*/ 2) set_data_dev(t4, /*action*/ ctx[1]);
    			if (!current || dirty & /*action*/ 2) set_data_dev(t7, /*action*/ ctx[1]);
    			if (!current || dirty & /*$potStore*/ 8) set_data_dev(t9, /*$potStore*/ ctx[3]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(backdrop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(backdrop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(backdrop, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();

    			if (if_block1) {
    				if_block1.d();
    			}

    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $potStore;
    	validate_store(potStore, "potStore");
    	component_subscribe($$self, potStore, $$value => $$invalidate(3, $potStore = $$value));
    	const dispatch = createEventDispatcher();
    	let { players } = $$props;
    	let { action } = $$props;
    	let player;
    	let amount;
    	let placeholder = `Amount to ${action}`;

    	function selectPlayer(event) {
    		let innerText = event.target.innerText;
    		$$invalidate(4, player = innerText.split(" ")[1]);
    		dispatch("transaction", { player, amount });
    	}

    	function selectPot(event) {
    		dispatch("transaction-pot", { amount });
    	}

    	function closeModal() {
    		dispatch("close-modal");
    	}

    	const writable_props = ["players", "action"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SelectPlayer> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		amount = to_number(this.value);
    		$$invalidate(2, amount);
    	}

    	$$self.$set = $$props => {
    		if ("players" in $$props) $$invalidate(0, players = $$props.players);
    		if ("action" in $$props) $$invalidate(1, action = $$props.action);
    	};

    	$$self.$capture_state = () => {
    		return {
    			players,
    			action,
    			player,
    			amount,
    			placeholder,
    			$potStore
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("players" in $$props) $$invalidate(0, players = $$props.players);
    		if ("action" in $$props) $$invalidate(1, action = $$props.action);
    		if ("player" in $$props) $$invalidate(4, player = $$props.player);
    		if ("amount" in $$props) $$invalidate(2, amount = $$props.amount);
    		if ("placeholder" in $$props) $$invalidate(5, placeholder = $$props.placeholder);
    		if ("$potStore" in $$props) potStore.set($potStore = $$props.$potStore);
    	};

    	return [
    		players,
    		action,
    		amount,
    		$potStore,
    		player,
    		placeholder,
    		selectPlayer,
    		selectPot,
    		closeModal,
    		dispatch,
    		input_input_handler
    	];
    }

    class SelectPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { players: 0, action: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectPlayer",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*players*/ ctx[0] === undefined && !("players" in props)) {
    			console.warn("<SelectPlayer> was created without expected prop 'players'");
    		}

    		if (/*action*/ ctx[1] === undefined && !("action" in props)) {
    			console.warn("<SelectPlayer> was created without expected prop 'action'");
    		}
    	}

    	get players() {
    		throw new Error("<SelectPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set players(value) {
    		throw new Error("<SelectPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<SelectPlayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<SelectPlayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ConfirmBankrupt.svelte generated by Svelte v3.16.7 */
    const file$2 = "src/ConfirmBankrupt.svelte";

    function create_fragment$2(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let p;
    	let t1;
    	let t2;
    	let input;
    	let t3;
    	let button0;
    	let t5;
    	let button1;
    	let current;
    	let dispose;
    	const backdrop = new BackDrop({ $$inline: true });
    	backdrop.$on("click", /*closeModal*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(backdrop.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t1 = text(/*message*/ ctx[0]);
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "Confirm";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			add_location(p, file$2, 25, 4, 527);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "confirm");
    			add_location(input, file$2, 28, 4, 560);
    			add_location(button0, file$2, 29, 4, 624);
    			attr_dev(button1, "class", "cancel-button svelte-1w9ire");
    			add_location(button1, file$2, 30, 4, 680);
    			attr_dev(div0, "class", "card svelte-1w9ire");
    			add_location(div0, file$2, 24, 2, 504);
    			attr_dev(div1, "class", "container svelte-1w9ire");
    			add_location(div1, file$2, 23, 0, 478);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    				listen_dev(button0, "click", /*confirmBankrupt*/ ctx[2], false, false, false),
    				listen_dev(button1, "click", /*closeModal*/ ctx[3], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(backdrop, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(div0, t2);
    			append_dev(div0, input);
    			set_input_value(input, /*verifyInput*/ ctx[1]);
    			append_dev(div0, t3);
    			append_dev(div0, button0);
    			append_dev(div0, t5);
    			append_dev(div0, button1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*message*/ 1) set_data_dev(t1, /*message*/ ctx[0]);

    			if (dirty & /*verifyInput*/ 2 && input.value !== /*verifyInput*/ ctx[1]) {
    				set_input_value(input, /*verifyInput*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(backdrop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(backdrop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(backdrop, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let verifyInput;
    	let { name } = $$props;
    	let { message = `To declare bankruptcy for ${name}, type 'BANKRUPT' in the field below` } = $$props;

    	function confirmBankrupt() {
    		if (verifyInput === "BANKRUPT") {
    			dispatch("bankrupt-user");
    		}
    	}

    	function closeModal() {
    		dispatch("close-modal");
    	}

    	const writable_props = ["name", "message"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ConfirmBankrupt> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		verifyInput = this.value;
    		$$invalidate(1, verifyInput);
    	}

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(4, name = $$props.name);
    		if ("message" in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => {
    		return { verifyInput, name, message };
    	};

    	$$self.$inject_state = $$props => {
    		if ("verifyInput" in $$props) $$invalidate(1, verifyInput = $$props.verifyInput);
    		if ("name" in $$props) $$invalidate(4, name = $$props.name);
    		if ("message" in $$props) $$invalidate(0, message = $$props.message);
    	};

    	return [
    		message,
    		verifyInput,
    		confirmBankrupt,
    		closeModal,
    		name,
    		dispatch,
    		input_input_handler
    	];
    }

    class ConfirmBankrupt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 4, message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConfirmBankrupt",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*name*/ ctx[4] === undefined && !("name" in props)) {
    			console.warn("<ConfirmBankrupt> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<ConfirmBankrupt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ConfirmBankrupt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<ConfirmBankrupt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<ConfirmBankrupt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Player.svelte generated by Svelte v3.16.7 */
    const file$3 = "src/Player.svelte";

    // (190:0) {#if prompt}
    function create_if_block_1$1(ctx) {
    	let div;
    	let current;

    	const selectplayer = new SelectPlayer({
    			props: {
    				players: /*otherPlayers*/ ctx[5],
    				action: /*prompt*/ ctx[3].action
    			},
    			$$inline: true
    		});

    	selectplayer.$on("transaction", function () {
    		if (is_function(/*prompt*/ ctx[3].transaction)) /*prompt*/ ctx[3].transaction.apply(this, arguments);
    	});

    	selectplayer.$on("transaction-pot", function () {
    		if (is_function(/*prompt*/ ctx[3].transactionPot)) /*prompt*/ ctx[3].transactionPot.apply(this, arguments);
    	});

    	selectplayer.$on("close-modal", /*close_modal_handler*/ ctx[21]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(selectplayer.$$.fragment);
    			attr_dev(div, "class", "select-player svelte-5agzv9");
    			add_location(div, file$3, 190, 2, 4615);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(selectplayer, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const selectplayer_changes = {};
    			if (dirty & /*otherPlayers*/ 32) selectplayer_changes.players = /*otherPlayers*/ ctx[5];
    			if (dirty & /*prompt*/ 8) selectplayer_changes.action = /*prompt*/ ctx[3].action;
    			selectplayer.$set(selectplayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectplayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectplayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(selectplayer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(190:0) {#if prompt}",
    		ctx
    	});

    	return block;
    }

    // (202:0) {#if confirmBankrupt}
    function create_if_block$1(ctx) {
    	let current;

    	const confirmbankrupt = new ConfirmBankrupt({
    			props: { name: /*name*/ ctx[2] },
    			$$inline: true
    		});

    	confirmbankrupt.$on("bankrupt-user", /*bankrupt*/ ctx[7]);
    	confirmbankrupt.$on("close-modal", /*close_modal_handler_1*/ ctx[22]);

    	const block = {
    		c: function create() {
    			create_component(confirmbankrupt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(confirmbankrupt, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const confirmbankrupt_changes = {};
    			if (dirty & /*name*/ 4) confirmbankrupt_changes.name = /*name*/ ctx[2];
    			confirmbankrupt.$set(confirmbankrupt_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(confirmbankrupt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(confirmbankrupt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(confirmbankrupt, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(202:0) {#if confirmBankrupt}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let div1;
    	let div0;
    	let h2;
    	let t0;
    	let t1;
    	let h4;
    	let t2;
    	let t3;
    	let t4;
    	let div5;
    	let div2;
    	let button0;
    	let t6;
    	let div3;
    	let button1;
    	let t8;
    	let button2;
    	let t10;
    	let div4;
    	let button3;
    	let section_id_value;
    	let t12;
    	let t13;
    	let if_block1_anchor;
    	let current;
    	let dispose;
    	let if_block0 = /*prompt*/ ctx[3] && create_if_block_1$1(ctx);
    	let if_block1 = /*confirmBankrupt*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(/*name*/ ctx[2]);
    			t1 = space();
    			h4 = element("h4");
    			t2 = text("$");
    			t3 = text(/*money*/ ctx[0]);
    			t4 = space();
    			div5 = element("div");
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Pay Player";
    			t6 = space();
    			div3 = element("div");
    			button1 = element("button");
    			button1.textContent = "Collect Money";
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "P";
    			t10 = space();
    			div4 = element("div");
    			button3 = element("button");
    			button3.textContent = "C";
    			t12 = space();
    			if (if_block0) if_block0.c();
    			t13 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(h2, "class", "svelte-5agzv9");
    			add_location(h2, file$3, 154, 6, 3836);
    			attr_dev(h4, "class", "svelte-5agzv9");
    			add_location(h4, file$3, 155, 6, 3858);
    			attr_dev(div0, "class", "svelte-5agzv9");
    			add_location(div0, file$3, 153, 4, 3824);
    			attr_dev(div1, "class", "headers svelte-5agzv9");
    			add_location(div1, file$3, 152, 2, 3798);
    			attr_dev(button0, "class", "normal-button svelte-5agzv9");
    			add_location(button0, file$3, 161, 6, 3977);
    			attr_dev(div2, "class", "svelte-5agzv9");
    			add_location(div2, file$3, 160, 4, 3965);
    			attr_dev(button1, "class", "normal-button svelte-5agzv9");
    			add_location(button1, file$3, 168, 6, 4139);
    			attr_dev(button2, "class", "small-button svelte-5agzv9");
    			add_location(button2, file$3, 173, 6, 4287);
    			attr_dev(div3, "class", "svelte-5agzv9");
    			add_location(div3, file$3, 167, 4, 4127);
    			attr_dev(button3, "class", "small-button svelte-5agzv9");
    			add_location(button3, file$3, 180, 6, 4439);
    			attr_dev(div4, "class", "svelte-5agzv9");
    			add_location(div4, file$3, 179, 4, 4427);
    			attr_dev(div5, "class", "buttons svelte-5agzv9");
    			add_location(div5, file$3, 159, 2, 3939);
    			attr_dev(section, "id", section_id_value = "p" + /*id*/ ctx[1]);
    			attr_dev(section, "class", "svelte-5agzv9");
    			add_location(section, file$3, 151, 0, 3775);

    			dispose = [
    				listen_dev(h4, "click", /*click_handler*/ ctx[16], false, false, false),
    				listen_dev(button0, "click", /*click_handler_1*/ ctx[17], false, false, false),
    				listen_dev(button1, "click", /*click_handler_2*/ ctx[18], false, false, false),
    				listen_dev(button2, "click", /*click_handler_3*/ ctx[19], false, false, false),
    				listen_dev(button3, "click", /*click_handler_4*/ ctx[20], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h4);
    			append_dev(h4, t2);
    			append_dev(h4, t3);
    			append_dev(section, t4);
    			append_dev(section, div5);
    			append_dev(div5, div2);
    			append_dev(div2, button0);
    			append_dev(div5, t6);
    			append_dev(div5, div3);
    			append_dev(div3, button1);
    			append_dev(div3, t8);
    			append_dev(div3, button2);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, button3);
    			insert_dev(target, t12, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t13, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 4) set_data_dev(t0, /*name*/ ctx[2]);
    			if (!current || dirty & /*money*/ 1) set_data_dev(t3, /*money*/ ctx[0]);

    			if (!current || dirty & /*id*/ 2 && section_id_value !== (section_id_value = "p" + /*id*/ ctx[1])) {
    				attr_dev(section, "id", section_id_value);
    			}

    			if (/*prompt*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t13.parentNode, t13);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*confirmBankrupt*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (detaching) detach_dev(t12);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t13);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $playerStore;
    	let $potStore;
    	validate_store(playerStore, "playerStore");
    	component_subscribe($$self, playerStore, $$value => $$invalidate(8, $playerStore = $$value));
    	validate_store(potStore, "potStore");
    	component_subscribe($$self, potStore, $$value => $$invalidate(9, $potStore = $$value));
    	const dispatch = createEventDispatcher();
    	let { id } = $$props;
    	let { name } = $$props;
    	let { money } = $$props;

    	const promptComponents = {
    		payPrompt: {
    			action: "Pay",
    			transaction: payPlayer,
    			transactionPot: payPot
    		},
    		collectPrompt: {
    			action: "Collect",
    			transaction: collectFrom,
    			transactionPot: collectPot
    		}
    	};

    	let prompt = false;
    	let confirmBankrupt = false;
    	let classes = "";

    	function payPlayer(event) {
    		const payer = name;
    		const payee = event.detail.player;
    		const amount = event.detail.amount;

    		if (!amount || amount < 1) {
    			dispatch("error", "Please enter an amount");
    			return false;
    		}

    		if (payee === "all") {
    			dispatch("send-message", `${name} is paying all`);
    			let total = amount * otherPlayers.length;

    			if (money < total) {
    				dispatch("error", `${name} does not have enough money for this transaction - $${total}`);
    				return false;
    			}

    			for (const player of otherPlayers) {
    				playerStore.payPlayer(payer, player.name, amount);
    				dispatch("send-message", `${name} paid ${player.name} $${amount}`);
    			}
    		} else {
    			if (money < amount) {
    				dispatch("error", `${name} does not have enough money for this transaction`);
    				return false;
    			}

    			playerStore.payPlayer(payer, payee, amount);
    			dispatch("send-message", `${name} paid ${payee} $${amount}`);
    		}

    		$$invalidate(3, prompt = false);
    	}

    	function collectFrom(event) {
    		const payer = event.detail.player;
    		const payee = name;
    		const amount = event.detail.amount;

    		if (!amount || amount < 1) {
    			dispatch("error", "Please enter an amount");
    			return false;
    		}

    		if (payer === "all") {
    			dispatch("send-message", `${name} is collecting from all`);

    			for (const player of otherPlayers) {
    				if (player.money < amount) {
    					dispatch("error", `${player.name} does not have enough money for this transaction`);
    				} else {
    					playerStore.payPlayer(player.name, payee, amount);
    					dispatch("send-message", `${name} collected $${amount} from ${player.name}`);
    				}
    			}
    		} else {
    			let payerPlayer = otherPlayers.filter(player => payer === player.name);

    			if (payerPlayer) {
    				payerPlayer = payerPlayer[0];
    			}

    			if (payerPlayer.money < amount) {
    				dispatch("error", `${payer} does not have enough money for this transaction`);
    				return false;
    			}

    			playerStore.payPlayer(payer, payee, amount);
    			dispatch("send-message", `${name} collected $${amount} from ${payer}`);
    		}

    		$$invalidate(3, prompt = false);
    	}

    	function payPot(event) {
    		const potAmount = event.detail.amount;

    		if (!potAmount || potAmount < 1) {
    			dispatch("error", "Please enter an amount");
    			return false;
    		}

    		if (money < potAmount) {
    			dispatch("error", `${name} does not have enough money for this transaction`);
    			return false;
    		}

    		$$invalidate(0, money -= potAmount);
    		playerStore.payPot(name, potAmount);
    		potStore.payPot(potAmount);
    		dispatch("send-message", `${name} put $${potAmount} into the Community Pot`);
    		$$invalidate(3, prompt = false);
    	}

    	function collectPot() {
    		playerStore.collectPot(name, $potStore);
    		dispatch("send-message", `${name} collected $${$potStore} from the Community Pot`);
    		$$invalidate(0, money += $potStore);
    		potStore.collectPot();
    		$$invalidate(3, prompt = false);
    	}

    	function bankrupt() {
    		playerStore.bankrupt(name);
    		dispatch("send-message", `${name} has gone bankrupt!`);
    	}

    	const writable_props = ["id", "name", "money"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(4, confirmBankrupt = true);
    	const click_handler_1 = () => $$invalidate(3, prompt = promptComponents.payPrompt);
    	const click_handler_2 = () => $$invalidate(3, prompt = promptComponents.collectPrompt);
    	const click_handler_3 = () => $$invalidate(3, prompt = promptComponents.payPrompt);
    	const click_handler_4 = () => $$invalidate(3, prompt = promptComponents.collectPrompt);
    	const close_modal_handler = () => $$invalidate(3, prompt = false);
    	const close_modal_handler_1 = () => $$invalidate(4, confirmBankrupt = false);

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("money" in $$props) $$invalidate(0, money = $$props.money);
    	};

    	$$self.$capture_state = () => {
    		return {
    			id,
    			name,
    			money,
    			prompt,
    			confirmBankrupt,
    			classes,
    			otherPlayers,
    			$playerStore,
    			$potStore
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("money" in $$props) $$invalidate(0, money = $$props.money);
    		if ("prompt" in $$props) $$invalidate(3, prompt = $$props.prompt);
    		if ("confirmBankrupt" in $$props) $$invalidate(4, confirmBankrupt = $$props.confirmBankrupt);
    		if ("classes" in $$props) classes = $$props.classes;
    		if ("otherPlayers" in $$props) $$invalidate(5, otherPlayers = $$props.otherPlayers);
    		if ("$playerStore" in $$props) playerStore.set($playerStore = $$props.$playerStore);
    		if ("$potStore" in $$props) potStore.set($potStore = $$props.$potStore);
    	};

    	let otherPlayers;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$playerStore, name*/ 260) {
    			 $$invalidate(5, otherPlayers = $playerStore.filter(player => player.name !== name));
    		}
    	};

    	return [
    		money,
    		id,
    		name,
    		prompt,
    		confirmBankrupt,
    		otherPlayers,
    		promptComponents,
    		bankrupt,
    		$playerStore,
    		$potStore,
    		dispatch,
    		classes,
    		payPlayer,
    		collectFrom,
    		payPot,
    		collectPot,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		close_modal_handler,
    		close_modal_handler_1
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 1, name: 2, money: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*id*/ ctx[1] === undefined && !("id" in props)) {
    			console.warn("<Player> was created without expected prop 'id'");
    		}

    		if (/*name*/ ctx[2] === undefined && !("name" in props)) {
    			console.warn("<Player> was created without expected prop 'name'");
    		}

    		if (/*money*/ ctx[0] === undefined && !("money" in props)) {
    			console.warn("<Player> was created without expected prop 'money'");
    		}
    	}

    	get id() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get money() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set money(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/LastMove.svelte generated by Svelte v3.16.7 */

    const file$4 = "src/LastMove.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let span;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(/*message*/ ctx[0]);
    			add_location(span, file$4, 7, 2, 59);
    			attr_dev(div, "class", "svelte-1315r04");
    			add_location(div, file$4, 6, 0, 42);
    			dispose = listen_dev(div, "click", /*click_handler*/ ctx[1], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1) set_data_dev(t, /*message*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { message } = $$props;
    	const writable_props = ["message"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LastMove> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("message" in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => {
    		return { message };
    	};

    	$$self.$inject_state = $$props => {
    		if ("message" in $$props) $$invalidate(0, message = $$props.message);
    	};

    	return [message, click_handler];
    }

    class LastMove extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LastMove",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*message*/ ctx[0] === undefined && !("message" in props)) {
    			console.warn("<LastMove> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<LastMove>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<LastMove>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MoveHistory.svelte generated by Svelte v3.16.7 */

    const file$5 = "src/MoveHistory.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (10:6) {#if moveHistory}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*moveHistory*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*moveHistory*/ 1) {
    				each_value = /*moveHistory*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(10:6) {#if moveHistory}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each moveHistory as move}
    function create_each_block$1(ctx) {
    	let div;
    	let li;
    	let t0_value = /*move*/ ctx[2] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(li, file$5, 12, 12, 211);
    			attr_dev(div, "class", "move svelte-cldokg");
    			add_location(div, file$5, 11, 10, 180);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, li);
    			append_dev(li, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*moveHistory*/ 1 && t0_value !== (t0_value = /*move*/ ctx[2] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(11:8) {#each moveHistory as move}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let ul;
    	let dispose;
    	let if_block = /*moveHistory*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			if (if_block) if_block.c();
    			add_location(ul, file$5, 8, 4, 105);
    			attr_dev(div0, "class", "moves svelte-cldokg");
    			add_location(div0, file$5, 7, 2, 72);
    			attr_dev(div1, "class", "container svelte-cldokg");
    			add_location(div1, file$5, 6, 0, 46);
    			dispose = listen_dev(div0, "click", /*click_handler*/ ctx[1], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			if (if_block) if_block.m(ul, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*moveHistory*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { moveHistory } = $$props;
    	const writable_props = ["moveHistory"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MoveHistory> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("moveHistory" in $$props) $$invalidate(0, moveHistory = $$props.moveHistory);
    	};

    	$$self.$capture_state = () => {
    		return { moveHistory };
    	};

    	$$self.$inject_state = $$props => {
    		if ("moveHistory" in $$props) $$invalidate(0, moveHistory = $$props.moveHistory);
    	};

    	return [moveHistory, click_handler];
    }

    class MoveHistory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { moveHistory: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MoveHistory",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*moveHistory*/ ctx[0] === undefined && !("moveHistory" in props)) {
    			console.warn("<MoveHistory> was created without expected prop 'moveHistory'");
    		}
    	}

    	get moveHistory() {
    		throw new Error("<MoveHistory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set moveHistory(value) {
    		throw new Error("<MoveHistory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/UI/Error.svelte generated by Svelte v3.16.7 */

    const { Error: Error_1 } = globals;
    const file$6 = "src/UI/Error.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (9:0) {#if messages}
    function create_if_block$3(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*messages*/ ctx[0];
    	const get_key = ctx => /*message*/ ctx[2];

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "errors svelte-7ps83s");
    			add_location(div, file$6, 9, 2, 107);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const each_value = /*messages*/ ctx[0];
    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    			check_outros();
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(9:0) {#if messages}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#each messages as message (message)}
    function create_each_block$2(key_1, ctx) {
    	let section;
    	let t0_value = /*message*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let section_transition;
    	let current;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			section = element("section");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(section, "class", "svelte-7ps83s");
    			add_location(section, file$6, 11, 6, 176);
    			dispose = listen_dev(section, "click", /*click_handler*/ ctx[1], false, false, false);
    			this.first = section;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, t0);
    			append_dev(section, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*messages*/ 1) && t0_value !== (t0_value = /*message*/ ctx[2] + "")) set_data_dev(t0, t0_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!section_transition) section_transition = create_bidirectional_transition(section, fly, { x: 900, duration: 300 }, true);
    				section_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!section_transition) section_transition = create_bidirectional_transition(section, fly, { x: 900, duration: 300 }, false);
    			section_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (detaching && section_transition) section_transition.end();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(11:4) {#each messages as message (message)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*messages*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*messages*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { messages = [] } = $$props;
    	const writable_props = ["messages"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Error> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("messages" in $$props) $$invalidate(0, messages = $$props.messages);
    	};

    	$$self.$capture_state = () => {
    		return { messages };
    	};

    	$$self.$inject_state = $$props => {
    		if ("messages" in $$props) $$invalidate(0, messages = $$props.messages);
    	};

    	return [messages, click_handler];
    }

    class Error$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { messages: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Error",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get messages() {
    		throw new Error_1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messages(value) {
    		throw new Error_1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/StartGame.svelte generated by Svelte v3.16.7 */
    const file$7 = "src/StartGame.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (82:2) {:else}
    function create_else_block(ctx) {
    	let div;
    	let t0;
    	let button;
    	let dispose;
    	let each_value = Array(/*numOfPlayers*/ ctx[1]);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			button.textContent = "Start Game";
    			attr_dev(div, "class", "player-container svelte-7mk1c2");
    			add_location(div, file$7, 82, 4, 1321);
    			attr_dev(button, "class", "svelte-7mk1c2");
    			add_location(button, file$7, 96, 4, 1744);
    			dispose = listen_dev(button, "click", /*initializeGame*/ ctx[2], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*players, numOfPlayers*/ 3) {
    				each_value = Array(/*numOfPlayers*/ ctx[1]);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(82:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (80:2) {#if numOfPlayers < 2 || numOfPlayers > 8 || !numOfPlayers}
    function create_if_block$4(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Please select a number of players between 2 and 8";
    			add_location(p, file$7, 80, 4, 1250);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(80:2) {#if numOfPlayers < 2 || numOfPlayers > 8 || !numOfPlayers}",
    		ctx
    	});

    	return block;
    }

    // (84:6) {#each Array(numOfPlayers) as i, index}
    function create_each_block$3(ctx) {
    	let article;
    	let label0;
    	let t0;
    	let br0;
    	let t1;
    	let input0;
    	let t2;
    	let label1;
    	let t3;
    	let br1;
    	let t4;
    	let input1;
    	let input1_updating = false;
    	let t5;
    	let dispose;

    	function input0_input_handler() {
    		/*input0_input_handler*/ ctx[5].call(input0, /*index*/ ctx[9]);
    	}

    	function input1_input_handler() {
    		input1_updating = true;
    		/*input1_input_handler*/ ctx[6].call(input1, /*index*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			label0 = element("label");
    			t0 = text("Player Name ");
    			br0 = element("br");
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			label1 = element("label");
    			t3 = text("Starting Cash ");
    			br1 = element("br");
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			add_location(br0, file$7, 86, 24, 1458);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$7, 87, 12, 1475);
    			add_location(label0, file$7, 85, 10, 1426);
    			add_location(br1, file$7, 90, 26, 1591);
    			attr_dev(input1, "type", "number");
    			input1.value = "1500";
    			add_location(input1, file$7, 91, 12, 1608);
    			add_location(label1, file$7, 89, 10, 1557);
    			attr_dev(article, "class", "svelte-7mk1c2");
    			add_location(article, file$7, 84, 8, 1406);

    			dispose = [
    				listen_dev(input0, "input", input0_input_handler),
    				listen_dev(input1, "input", input1_input_handler)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, label0);
    			append_dev(label0, t0);
    			append_dev(label0, br0);
    			append_dev(label0, t1);
    			append_dev(label0, input0);
    			set_input_value(input0, /*players*/ ctx[0][/*index*/ ctx[9]].name);
    			append_dev(article, t2);
    			append_dev(article, label1);
    			append_dev(label1, t3);
    			append_dev(label1, br1);
    			append_dev(label1, t4);
    			append_dev(label1, input1);
    			set_input_value(input1, /*players*/ ctx[0][/*index*/ ctx[9]].money);
    			append_dev(article, t5);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*players*/ 1 && input0.value !== /*players*/ ctx[0][/*index*/ ctx[9]].name) {
    				set_input_value(input0, /*players*/ ctx[0][/*index*/ ctx[9]].name);
    			}

    			if (!input1_updating && dirty & /*players*/ 1) {
    				set_input_value(input1, /*players*/ ctx[0][/*index*/ ctx[9]].money);
    			}

    			input1_updating = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(84:6) {#each Array(numOfPlayers) as i, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let label;
    	let t2;
    	let br0;
    	let t3;
    	let input;
    	let input_updating = false;
    	let t4;
    	let br1;
    	let t5;
    	let dispose;

    	function input_input_handler() {
    		input_updating = true;
    		/*input_input_handler*/ ctx[4].call(input);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*numOfPlayers*/ ctx[1] < 2 || /*numOfPlayers*/ ctx[1] > 8 || !/*numOfPlayers*/ ctx[1]) return create_if_block$4;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Monopoly Bank";
    			t1 = space();
    			label = element("label");
    			t2 = text("How many players? ");
    			br0 = element("br");
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			if_block.c();
    			add_location(h1, file$7, 73, 2, 1054);
    			add_location(br0, file$7, 75, 22, 1109);
    			attr_dev(input, "type", "number");
    			add_location(input, file$7, 76, 4, 1118);
    			add_location(label, file$7, 74, 2, 1079);
    			add_location(br1, file$7, 78, 2, 1179);
    			attr_dev(div, "class", "container svelte-7mk1c2");
    			add_location(div, file$7, 72, 0, 1028);
    			dispose = listen_dev(input, "input", input_input_handler);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, label);
    			append_dev(label, t2);
    			append_dev(label, br0);
    			append_dev(label, t3);
    			append_dev(label, input);
    			set_input_value(input, /*numOfPlayers*/ ctx[1]);
    			append_dev(div, t4);
    			append_dev(div, br1);
    			append_dev(div, t5);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!input_updating && dirty & /*numOfPlayers*/ 2) {
    				set_input_value(input, /*numOfPlayers*/ ctx[1]);
    			}

    			input_updating = false;

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();

    	let players = [
    		{ id: 1, name: "", money: 1500 },
    		{ id: 2, name: "", money: 1500 },
    		{ id: 3, name: "", money: 1500 },
    		{ id: 4, name: "", money: 1500 },
    		{ id: 5, name: "", money: 1500 },
    		{ id: 6, name: "", money: 1500 },
    		{ id: 7, name: "", money: 1500 },
    		{ id: 8, name: "", money: 1500 }
    	];

    	let numOfPlayers = 2;

    	function initializeGame() {
    		const existingPlayers = players.filter(player => {
    			if (player.name && typeof player.money === "number" && player.money > 1) {
    				return player.name;
    			}
    		});

    		if (existingPlayers.length !== numOfPlayers) {
    			dispatch("error", "Wrong number of players");
    			return false;
    		} else {
    			playerStore.setPlayers(existingPlayers);
    			dispatch("initialize-game");
    		}
    	}

    	function input_input_handler() {
    		numOfPlayers = to_number(this.value);
    		$$invalidate(1, numOfPlayers);
    	}

    	function input0_input_handler(index) {
    		players[index].name = this.value;
    		$$invalidate(0, players);
    	}

    	function input1_input_handler(index) {
    		players[index].money = to_number(this.value);
    		$$invalidate(0, players);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("players" in $$props) $$invalidate(0, players = $$props.players);
    		if ("numOfPlayers" in $$props) $$invalidate(1, numOfPlayers = $$props.numOfPlayers);
    	};

    	return [
    		players,
    		numOfPlayers,
    		initializeGame,
    		dispatch,
    		input_input_handler,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class StartGame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StartGame",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.7 */

    const { Error: Error_1$1 } = globals;
    const file$8 = "src/App.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (40:0) {#if errorMessages}
    function create_if_block_2$1(ctx) {
    	let current;

    	const error = new Error$1({
    			props: { messages: /*errorMessages*/ ctx[3] },
    			$$inline: true
    		});

    	error.$on("click", /*clearErrors*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(error.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(error, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const error_changes = {};
    			if (dirty & /*errorMessages*/ 8) error_changes.messages = /*errorMessages*/ ctx[3];
    			error.$set(error_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(error.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(error.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(error, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(40:0) {#if errorMessages}",
    		ctx
    	});

    	return block;
    }

    // (48:0) {:else}
    function create_else_block$1(ctx) {
    	let header;
    	let t0;
    	let t1;
    	let main;
    	let section;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;

    	const lastmove = new LastMove({
    			props: { message: /*lastMove*/ ctx[2] },
    			$$inline: true
    		});

    	lastmove.$on("click", /*click_handler*/ ctx[11]);
    	let if_block = /*viewHistory*/ ctx[0] && create_if_block_1$2(ctx);
    	let each_value = /*$playerStore*/ ctx[5];
    	const get_key = ctx => /*player*/ ctx[13].id;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(lastmove.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			main = element("main");
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(header, file$8, 50, 0, 1063);
    			attr_dev(section, "class", "svelte-1jvxijp");
    			add_location(section, file$8, 64, 2, 1307);
    			attr_dev(main, "class", "svelte-1jvxijp");
    			add_location(main, file$8, 63, 0, 1298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(lastmove, header, null);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lastmove_changes = {};
    			if (dirty & /*lastMove*/ 4) lastmove_changes.message = /*lastMove*/ ctx[2];
    			lastmove.$set(lastmove_changes);

    			if (/*viewHistory*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const each_value = /*$playerStore*/ ctx[5];
    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    			check_outros();
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lastmove.$$.fragment, local);
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lastmove.$$.fragment, local);
    			transition_out(if_block);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(lastmove);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(48:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:0) {#if startGamePrompt}
    function create_if_block$5(ctx) {
    	let current;
    	const startgame = new StartGame({ $$inline: true });
    	startgame.$on("error", /*showError*/ ctx[7]);
    	startgame.$on("initialize-game", /*initialize_game_handler*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(startgame.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(startgame, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(startgame.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(startgame.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(startgame, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(44:0) {#if startGamePrompt}",
    		ctx
    	});

    	return block;
    }

    // (57:2) {#if viewHistory}
    function create_if_block_1$2(ctx) {
    	let current;

    	const movehistory = new MoveHistory({
    			props: { moveHistory: /*moveHistory*/ ctx[1] },
    			$$inline: true
    		});

    	movehistory.$on("click", /*click_handler_1*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(movehistory.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(movehistory, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const movehistory_changes = {};
    			if (dirty & /*moveHistory*/ 2) movehistory_changes.moveHistory = /*moveHistory*/ ctx[1];
    			movehistory.$set(movehistory_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(movehistory.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(movehistory.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(movehistory, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(57:2) {#if viewHistory}",
    		ctx
    	});

    	return block;
    }

    // (66:4) {#each $playerStore as player (player.id)}
    function create_each_block$4(key_1, ctx) {
    	let first;
    	let current;

    	const player = new Player({
    			props: {
    				id: /*player*/ ctx[13].id,
    				name: /*player*/ ctx[13].name,
    				money: /*player*/ ctx[13].money
    			},
    			$$inline: true
    		});

    	player.$on("send-message", /*receiveMessage*/ ctx[6]);
    	player.$on("error", /*showError*/ ctx[7]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(player.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(player, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const player_changes = {};
    			if (dirty & /*$playerStore*/ 32) player_changes.id = /*player*/ ctx[13].id;
    			if (dirty & /*$playerStore*/ 32) player_changes.name = /*player*/ ctx[13].name;
    			if (dirty & /*$playerStore*/ 32) player_changes.money = /*player*/ ctx[13].money;
    			player.$set(player_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(player, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(66:4) {#each $playerStore as player (player.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*errorMessages*/ ctx[3] && create_if_block_2$1(ctx);
    	const if_block_creators = [create_if_block$5, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*startGamePrompt*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*errorMessages*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $playerStore;
    	validate_store(playerStore, "playerStore");
    	component_subscribe($$self, playerStore, $$value => $$invalidate(5, $playerStore = $$value));
    	let viewHistory = false;
    	let moveHistory = [];
    	let lastMove = "Click a player's money to bankrupt them";
    	let errorMessages = [];
    	let clickedError = "";
    	let startGamePrompt = true;

    	function receiveMessage(event) {
    		$$invalidate(2, lastMove = event.detail);
    		$$invalidate(1, moveHistory = [lastMove, ...moveHistory]);
    	}

    	function showError(event) {
    		$$invalidate(3, errorMessages = [...errorMessages, event.detail]);
    	}

    	function clearErrors(event) {
    		const error = event.target.innerText;

    		$$invalidate(3, errorMessages = errorMessages.filter(i => {
    			return i !== error;
    		}));
    	}

    	const initialize_game_handler = () => $$invalidate(4, startGamePrompt = false);
    	const click_handler = () => $$invalidate(0, viewHistory = !viewHistory);
    	const click_handler_1 = () => $$invalidate(0, viewHistory = false);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("viewHistory" in $$props) $$invalidate(0, viewHistory = $$props.viewHistory);
    		if ("moveHistory" in $$props) $$invalidate(1, moveHistory = $$props.moveHistory);
    		if ("lastMove" in $$props) $$invalidate(2, lastMove = $$props.lastMove);
    		if ("errorMessages" in $$props) $$invalidate(3, errorMessages = $$props.errorMessages);
    		if ("clickedError" in $$props) clickedError = $$props.clickedError;
    		if ("startGamePrompt" in $$props) $$invalidate(4, startGamePrompt = $$props.startGamePrompt);
    		if ("$playerStore" in $$props) playerStore.set($playerStore = $$props.$playerStore);
    	};

    	return [
    		viewHistory,
    		moveHistory,
    		lastMove,
    		errorMessages,
    		startGamePrompt,
    		$playerStore,
    		receiveMessage,
    		showError,
    		clearErrors,
    		clickedError,
    		initialize_game_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
