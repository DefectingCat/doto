import { syntaxTree } from "@codemirror/language";
import { Extension, Range, StateField, Transaction } from "@codemirror/state";
import {
    Decoration,
    DecorationSet,
    EditorView,
    WidgetType,
} from "@codemirror/view";
import { createDOM, isUrl, LinkResult } from "utils";

export class LinkWidget extends WidgetType {
    loading = false;

    constructor(public url: string) {
        super();
    }
    toDOM(view: EditorView): HTMLElement {
        const wrapper = createDOM("div", "link-wrapper");
        ajaxPromise({
            url: `http://iframely.server.crestify.com/iframely?url=${this.url}`,
        }).then((res) => {
            const result = JSON.parse(res) as LinkResult;
            const imageUrl =
                result.links.find((v) => v.type.startsWith("image/"))?.href ??
                "";
            const img = createDOM("img", "link-image");
            img.src = imageUrl;
            const imgWrapper = createDOM("div", "link-iamge-wrapper");
            imgWrapper.append(img);
            wrapper.append(imgWrapper);

            const info = createDOM("div", "link-info");
            info.append(createDOM("div", "link-title", result.meta.title));
            info.append(createDOM("div", "link-desc", result.meta.description));
            info.append(createDOM("div", "link-url", this.url));
            wrapper.append(info);
        });
        return wrapper;
    }
    eq(widget: LinkWidget): boolean {
        return this.loading === widget.loading;
    }
    updateDOM(dom: HTMLElement, view: EditorView): boolean {
        dom.textContent = "test updated";
        return true;
    }
}

export const LinkPreviewField = StateField.define<DecorationSet>({
    create(state): DecorationSet {
        return Decoration.none;
    },
    update(oldState: DecorationSet, transaction: Transaction) {
        const widgets: Range<Decoration>[] = [];

        syntaxTree(transaction.state).iterate({
            enter(node) {
                console.log(node.type);
                if (!node.type.name.contains("link")) return;
                const nodeContent = transaction.state.doc.sliceString(
                    node.from,
                    node.to,
                );
                if (nodeContent !== ")") return;
                // previous sibling is link url
                const sibling = node.node.resolve(node.from - 1);
                const url = transaction.state.doc.sliceString(
                    sibling.from,
                    sibling.to,
                );
                if (!url || !isUrl(url) || !node.node.parent?.to) return;
                const deco = Decoration.widget({
                    widget: new LinkWidget(url),
                    block: true,
                    side: 1,
                });
                widgets.push(deco.range(node.node.parent.to));
            },
        });

        return Decoration.set(widgets);
    },
    provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field);
    },
});
