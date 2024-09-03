import { slugifyStr } from "@utils/slugify";

export interface Props {
  href?: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export default function Project({
  href,
  title,
  description,
  disabled = false,
}: Props) {
  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <a
        href={href}
        target={"_blank"}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {disabled ? (
          <del>
            <h2 {...headerProps}>{title}</h2>
          </del>
        ) : (
          <h2 {...headerProps}>{title}</h2>
        )}
      </a>
      <div className={`flex items-center space-x-2 opacity-80`}>
        <span>{description}</span>
      </div>
    </li>
  );
}
