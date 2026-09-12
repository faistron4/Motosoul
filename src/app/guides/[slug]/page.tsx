// "/guides/[slug]" - single guide page
type Props = {
  params: { slug: string };
};

export default function GuideDetailPage({ params }: Props) {
  return (
    <article>
      <h1>Guide: {params.slug}</h1>
    </article>
  );
}
