import Image from 'next/image';
import Link from 'next/link';

export default function Guide() {
  return (
    <article className="article-shell">
      <span className="eyebrow">The water notes</span>
      <h1>Getting to know hard water</h1>
      <p className="article-lead">
        A little understanding can make your haircare routine feel less like guesswork.
      </p>
      <Image
        className="article-image"
        src="/images/guide-hair.png"
        alt="Haircare comb and botanical details"
        width={1200}
        height={675}
        sizes="(max-width: 768px) 100vw, 850px"
      />
      <h2>What is hard water?</h2>
      <p>
        Hard water contains dissolved minerals, mainly calcium and magnesium. The amount varies by
        location and water source. A water test is the most reliable way to understand your water.
      </p>
      <h2>What might you notice?</h2>
      <p>
        At home, you may see white marks on taps or kettles, or notice that soap does not lather as
        easily. Hair may sometimes feel rough, coated, dull or harder to detangle. These signs alone
        cannot confirm water hardness.
      </p>
      <h2>Where haircare fits in</h2>
      <p>
        Chelating ingredients can bind certain minerals so they can be rinsed away. A hard-water
        shampoo may help remove mineral buildup that makes hair feel dry or heavy. It does not treat
        medical causes of hair fall. If you are worried about hair loss or scalp symptoms, speak
        with a qualified clinician.
      </p>
      <h2>Build a simple routine</h2>
      <p>
        Follow each product’s final label for frequency, amount and suitability. Start gently and
        pay attention to how your hair responds. Product directions and claims must be confirmed
        before launch.
      </p>
      <div className="article-cta">
        <Link className="btn btn-primary" href="/shop">
          Explore haircare
        </Link>
        <Link className="btn btn-outline" href="/quiz">
          Take the routine quiz
        </Link>
      </div>
      <small className="muted">
        Educational sample copy. Add and review reliable references before publishing.
      </small>
    </article>
  );
}
