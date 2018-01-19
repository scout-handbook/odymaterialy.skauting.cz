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

		if(strpos($block['url'], APIURI * '/image') !== false)
		{
			if(strpos($block['url'], 'quality=') !== false)
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
		if(strncmp($line, '!' . $command, strlen($command) + 1) === 0)
		{
			return true;
		}
		return false;
	}

	private function consumeCommand(array $lines, int $current, string $command) : array
	{
		$block = [$command];
		$line = rtrim($lines[$current]);
		$start = intval(strpos($line, '[', strlen($command) + 1)) + 1;
		$next = $current;
		$argumentString = '';
		if($start !== false)
		{
			$stop = strpos($line, ']', $start);
			if($stop !== false)
			{
				$argumentString = substr($line, $start, $stop - $start);
				$next = $current;
			}
			else
			{
				$argumentString = substr($line, $start);
				for($i = $current + 1; $i < count($lines); ++$i)
				{
					$stop = strpos($lines[$i], "]");
					if($stop !== false)
					{
						$argumentString .= substr($lines[$i], 0, $stop);
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
		$argumentArray = explode(',', strval($argumentString));
		foreach($argumentArray as $arg)
		{
			$keyval = explode('=', $arg);
			if(count($keyval) !== 2)
			{
				break;
			}
			$block[$keyval[0]] = $keyval[1];
		}
		return [$block, $next];
	}

	// Notes extension
	protected function identifyNotes(string $line) : bool
	{
		return $this->identifyCommand($line, 'notes');
	}

	protected function consumeNotes(array $lines, int $current) : array
	{
		return $this->consumeCommand($lines, $current, 'notes');
	}

	protected function renderNotes(array $block) : string
	{
		$leader = '';
		if(isset($block['style']) and $block['style'] === 'dotted')
		{
			$leader = '.';
		}
		$height = 1;
		if(isset($block['height']))
		{
			if($block["height"] === 'eop')
			{
				return ''; // FIXME: lines until end of page
			}
			else
			{
				$height = intval($block['height']);
			}
		}
		return str_repeat('<br><div class="dottedline">' . str_repeat($leader, 256) . '</div>', $height);
	}
}
