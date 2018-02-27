<?php declare(strict_types=1);
namespace OdyMarkdown;

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');

use \cebe\markdown\GithubMarkdown;

class OdyMarkdown extends GithubMarkdown
{
	// Link rendering as text with address in parentheses
	protected function renderLink($block) : string
	{
		if(isset($block['refkey']))
		{
			if(($ref = $this->lookupReference($block['refkey'])) !== false)
			{
				$block = array_merge($block, $ref);
			}
			else
			{
				return $block['orig'];
			}
		}
		return $this->renderAbsy($block['text']) . ' (<a href="' . htmlspecialchars($block['url'], ENT_COMPAT | ENT_HTML401, 'UTF-8') . '">' . htmlspecialchars($block['url'], ENT_COMPAT | ENT_HTML401, 'UTF-8') . '</a>) ';
	}

	// Image rendering in original quality
	protected function renderImage($block) : string
	{
		global $APIURI;
		if(isset($block['refkey']))
		{
			if(($ref = $this->lookupReference($block['refkey'])) !== false)
			{
				$block = array_merge($block, $ref);
			}
			else
			{
				return $block['orig'];
			}
		}

		if(mb_strpos($block['url'], $APIURI . '/image') !== false)
		{
			if(mb_strpos($block['url'], 'quality=') !== false)
			{
				$block['url'] = str_replace('quality=web', 'quality=original', $block['url']);
				$block['url'] = str_replace('quality=thumbnail', 'quality=original', $block['url']);
			}
			else
			{
				$block['url'] .= '?quality=original';
			}
		}

		return parent::renderImage($block);
	}

	// Generic functions for command parsing
	private function identifyCommand(string $line, string $command) : bool
	{
		if(strncmp($line, '!' . $command, mb_strlen($command) + 1) === 0)
		{
			return true;
		}
		return false;
	}

	private function consumeCommand(array $lines, int $current, string $command) : array
	{
		$block = [$command, 'lastPage' => ($current + 1 == count($lines))];
		[$argumentString, $next] = self::getArgumentString($lines, $current, $command);
		$argumentArray = explode(',', strval($argumentString));
		foreach($argumentArray as $arg)
		{
			$keyval = explode('=', $arg);
			if(count($keyval) === 1)
			{
				$block[$keyval[0]] = true;
			}
			elseif(count($keyval) === 2)
			{
				$block[$keyval[0]] = $keyval[1];
			}
			else
			{
				break;
			}
		}
		return [$block, $next];
	}


	private static function getArgumentString(array $lines, int $current, string $command) : array
	{
		$line = rtrim($lines[$current]);
		$next = $current;
		$argumentString = '';
		$start = intval(mb_strpos($line, '[', mb_strlen($command) + 1)) + 1;
		if($start !== false)
		{
			$stop = mb_strpos($line, ']', $start);
			if($stop !== false)
			{
				$argumentString = mb_substr($line, $start, $stop - $start);
				$next = $current;
			}
			else
			{
				$argumentString = mb_substr($line, $start);
				for($i = $current + 1; $i < count($lines); ++$i)
				{
					$stop = mb_strpos($lines[$i], "]");
					if($stop !== false)
					{
						$argumentString .= mb_substr($lines[$i], 0, $stop);
						$next = $i;
						break;
					}
					else
					{
						$argumentString .= $lines[$i];
					}
				}
			}
		}
		$argumentString = str_replace(' ', '', strval($argumentString));
		return [$argumentString, $next];
	}

	// Notes extension
	protected function identifyNotes(string $line) : bool
	{
		return $this->identifyCommand($line, 'linky');
	}

	protected function consumeNotes(array $lines, int $current) : array
	{
		return $this->consumeCommand($lines, $current, 'linky');
	}

	protected function renderLinky(array $block) : string
	{
		$dotted = (isset($block['teckovane']) and $block['teckovane'] === true);
		$height = 1;
		if(isset($block['pocet']))
		{
			if($block['pocet'] === 'strana')
			{
				if($dotted)
				{
					$ret = '<br><div class="dottedpage"></div>';
					return $block['lastPage'] ? $ret : $ret . '<pagebreak>';
				}
				else
				{
					return $block['lastPage'] ? '' : '<pagebreak>';
				}
			}
			else
			{
				$height = intval($block['pocet']);
			}
		}
		if($dotted)
		{
			return str_repeat('<br><div class="dottedline">' . str_repeat('.', 256) . '</div>', $height);
		}
		else
		{
			return str_repeat('<br>', $height);
		}
	}
}
